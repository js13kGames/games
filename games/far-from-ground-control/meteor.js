class Meteor extends Obj3d {
    static vb64 = "fgR+00m8W0bpGEt+WUMN1Ek/oLXnIbfBJ7Q/oLQX5rJ+fu9+Yi7Vaxu4dAKdmAORtg2nyyu2wj7VoDvlej/q4EJa6jx+5j6kmAVstg5Vyi1HGid+QRx+YAt+R0XQJTq/EDyeYzEqaxlDdQlhETxfLkFERUMpej4QnEIhvkEr7puP8X6j7l247l1E7n5a6ZpukZ3zfn71bGHr0GDPxH7espzkHpqvDX6jAF2STGHiMn7mLpvNMJswNH4YS2EZEGFtB35XGJxKsJsbxH4e1F8pa18Hfn4AkJwO3ria0r67t7nTgrvnXcDkP7rPFb+kD8N+I7ZdQ7YyXMMUgsEMuLso079A5LxhiP2dkue8ndTc39J+veN+nvh+Z+uPTt6hN8qxZPxrRu1WMdJGiP9ekudBnNMhq+5dx9Fgttk8bPFIeNQtVdA8Seh+KtlqKNqTbeyyT9zKeNbRq+6ftda+zNee8KNG6X4w1qIkbaAIWn4RRKIPAKNoA35+A6KTSJ/kWX7xbaDy0aDU6n7M5p+xpH4KtlsTjl4RFH4xM18xEVtIFX7KEluzMl/Npn74j1z0tFzl835+7F6R/Florh8xkAdGhSAlRSI7TwlcMCVeLyWfUA2fSiu71x5ozCmRsxV+hCvNjw+zrh7M"
    static ib64 = "AA8OAREXAA4dAB0jACMYARcsAhQyAyA4BCY+BSlEASwzAjI5Azg/BD5FBUQtBkpZB01fCFBiCVNlClZaXGMLW2ZcWmdbXGZjZmRjW2dmZ2hmZmhkaGVkWlZnVlVnZ1VoVVRoaFRlVAllY2ALZGljZWpkY2lgaWFgZGppamtpaWtha2JhZVNqU1JqalJrUlFra1FiUQhiYF0LYWxgYm1hYGxdbF5dYW1sbW5sbG5ebl9eYlBtUE9tbU9uT05ubk5fTgdfXVcLXm9dX3BeXW9Xb1hXXnBvcHFvb3FYcVlYX01wTUxwcExxTEtxcUtZSwZZV1wLWHJXWXNYV3JccltcWHNyc3RycnRbdFpbWUpzSklzc0l0SUh0dEhaSApaL1YKLnUvLXYuL3VWdVVWLnZ1dnd1dXdVd1RVLUR2REN2dkN3Q0J3d0JUQglUR1MJRnhHRXlGR3hTeFJTRnl4eXp4eHpSelFSRT55Pj15eT16PTx6ejxRPAhRQVAIQHtBP3xAQXtQe09QQHx7fH17e31PfU5PPzh8ODd8fDd9NzZ9fTZONgdOO00HOn47OX86O35NfkxNOn9+f4B+foBMgEtMOTJ/MjF/fzGAMTCAgDBLMAZLNUoGNIE1M4I0NYFKgUlKNIKBgoOBgYNJg0hJMyyCLCuCgiuDKyqDgypIKgpIQkcJQ4RCRIVDQoRHhEZHQ4WEhYaEhIZGhkVGRCmFKSiFhSiGKCeGhidFJwRFPEEIPYc8Pog9PIdBh0BBPYiHiImHh4lAiT9APiaIJiWIiCWJJSSJiSQ/JAM/NjsHN4o2OIs3Noo7ijo7N4uKi4yKiow6jDk6OCCLIB+Lix+MHx6MjB45HgI5MDUGMY0wMo4xMI01jTQ1MY6Njo+NjY80jzM0MhSOFBOOjhOPExKPjxIzEgEzKi8KK5AqLJErKpAvkC4vK5GQkZKQkJIuki0uLBeRFxaRkRaSFhWSkhUtFQUtGikFGZMaGJQZGpMpkygpGZSTlJWTk5UolScoGCOUIyKUlCKVIiGVlSEnIQQnISYEIpYhI5ciIZYmliUmIpeWl5iWlpglmCQlIx2XHRyXlxyYHBuYmBskGwMkGyADHJkbHZocG5kgmR8gHJqZmpuZmZsfmx4fHQ6aDg2amg2bDQybmwweDAIeFRoFFpwVF50WFZwanBkaFp2cnZ6cnJ4ZnhgZFxGdERCdnRCeEA+eng8YDwAYDBQCDZ8MDqANDJ8UnxMUDaCfoKGfn6EToRITDg+gDxCgoBChEBGhoRESEQES"        
    constructor(wgl) {
        const id = Math.random().toString(16).slice(-6)
        super(`meteor-${id}`, b64Buffer(Meteor.vb64, Meteor.ib64), wgl)
        const color = 0.6 + 0.2 * Math.random()
        this.color = [0.9 * color, 0.8 * color, 0.6 * color]
        this.v = {x: 0.1 * (Math.random()-0.5), y: 0.1 * (Math.random()-0.5 - 0.04)}
        this.tumble = {x: 0.01 * Math.random(), y: 0.01 * Math.random(), z: 0.01 * Math.random()}
        this.scale = 0.5 + 0.5 * Math.random()
        const r = 11 + 2 * Math.random()
        const alpha = 2 * Math.PI * Math.random()
        this.pos[0] = r * Math.cos(alpha)
        this.pos[1] = 5 + r * Math.sin(alpha)
        this.pos[2] = 0
    }

    draw () {
        this.pos[0] += this.v.x
        this.pos[1] += this.v.y
        this.setRotation(this.rot.x + this.tumble.x, this.rot.y + this.tumble.y, this.rot.z + this.tumble.z)
        super.draw()
    }
}