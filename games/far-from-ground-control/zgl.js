class WebGL {
    objects = []

    vertCode = `#version 300 es
    in vec3 a_vertPos;
    uniform vec3 u_objPos;
    uniform mat3 u_objRot;
    uniform float u_objScale;
    uniform float u_screenAspect;
    uniform mat4 u_projection;
    out vec3 v_screenPos;
    out vec3 v_vertPos;
    void main() {
        vec3 pos = u_objRot * a_vertPos * u_objScale + u_objPos;
        gl_Position = u_projection * vec4(pos.x, u_screenAspect * pos.y, pos.z, 1.0);
        gl_PointSize = 3.0;
        v_screenPos = pos;
        v_vertPos = a_vertPos;
    }`

    fragCode = `#version 300 es
    precision lowp float;
    in vec3 v_screenPos;
    in vec3 v_vertPos;
    uniform vec3 u_objColor;
    out vec4 fragColor;
    void main(void) {
        float n = 0.8 * normalize(cross(dFdx(v_screenPos), dFdy(v_screenPos))).z;
        fragColor = vec4(n * u_objColor.x + 0.2, n * u_objColor.y + (1.0 - v_vertPos.z)/50.0 + 0.2, n * u_objColor.z + (1.0 - v_vertPos.z)/30.0 + 0.2,  1);
    }`

    constructor(canvas) {
        const gl = canvas.getContext("webgl2")
        this.gl = gl
        gl.enable(gl.CULL_FACE)
        
        const aspect = canvas.width / canvas.height;
        const projectionMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]

        const vertShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertShader, this.vertCode)
        gl.compileShader(vertShader)

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragShader, this.fragCode)
        gl.compileShader(fragShader)

        const shaderProgram = gl.createProgram()
        gl.attachShader(shaderProgram, vertShader)
        gl.attachShader(shaderProgram, fragShader)
        gl.linkProgram(shaderProgram)
        gl.useProgram(shaderProgram)

        this.A_VERT_POS = gl.getAttribLocation(shaderProgram, "a_vertPos")
        this.U_OBJ_POS = gl.getUniformLocation(shaderProgram, "u_objPos")
        this.U_OBJ_ROT = gl.getUniformLocation(shaderProgram, "u_objRot")
        this.U_OBJ_SCALE = gl.getUniformLocation(shaderProgram, "u_objScale")
        this.U_SCREEN_ASPECT = gl.getUniformLocation(shaderProgram, "u_screenAspect")
        this.U_OBJ_COLOR = gl.getUniformLocation(shaderProgram, "u_objColor")
        this.U_PROJECTION = gl.getUniformLocation(shaderProgram, "u_projection")

        gl.uniform1f(this.U_SCREEN_ASPECT, aspect)
        gl.uniformMatrix4fv(this.U_PROJECTION, false, projectionMatrix)
    }

    render() {
        for (let object of this.objects) {
            object.draw()
        }
    }

}


class Obj3d {
    pos = [0, 0, 0]
    rot = {x:0, y:0, z:0}
    dcm = [1, 0, 0, 0, 1, 0, 0, 0, 1]
    color = [1, 1, 1]
    scale = 1
    cr = 0.5
    constructor (name, geometry, wgl) {
        this.name = name
        const gl = wgl.gl
        this.wgl = wgl
        const vao = gl.createVertexArray()
        gl.bindVertexArray(vao)
        const vertex_buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.vertex), gl.STATIC_DRAW)
        const index_buffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.index), gl.STATIC_DRAW)
        gl.vertexAttribPointer(this.wgl.A_VERT_POS, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.wgl.A_VERT_POS)
        gl.bindVertexArray(null)
        this.vao = vao
        this.vertex_buffer = vertex_buffer
        this.count = geometry.index.length
    }

    setVertexBuffer (geometry) {
        const gl = this.wgl.gl
        gl.bindVertexArray(this.vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.vertex), gl.STATIC_DRAW)
        gl.bindVertexArray(null)
    }

    setRotation (x, y, z) {
        this.rot = {x, y, z}
        const [c, s] = [Math.cos, Math.sin]
        const [sx, cx, sy, cy, sz, cz] = [s(x), c(x), s(y), c(y), s(z), c(z)]
        this.dcm = [cy*cz, cy*sz, -sy, sy*sx*cz-sz*cx, sy*sx*sz+cz*cx, cy*sx, sy*cx*cz+sz*sx, sy*cx*sz-cz*sx, cy*cx]
    }

    draw () {
        const gl = this.wgl.gl
        gl.bindVertexArray(this.vao)
        gl.uniform3fv(this.wgl.U_OBJ_POS, this.pos)
        gl.uniformMatrix3fv(this.wgl.U_OBJ_ROT, false, this.dcm)
        gl.uniform1f(this.wgl.U_OBJ_SCALE, this.scale)
        gl.uniform3fv(this.wgl.U_OBJ_COLOR, this.color)
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0)
        gl.bindVertexArray(null)
    }
}


const b64Buffer = (vb64, ib64) => {
    const vertex = new Float32Array([...atob(vb64)].map(x=>x.codePointAt())).map(x => x/256 - 0.5)
    const index = new Uint16Array([...atob(ib64)].map(x=>x.codePointAt()))
    return {vertex, index}
}