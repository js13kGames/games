let d1;
const screens = [
  d1 = new Screen({
    init: function () {
      this.s = 0;
    },
    onclick: async function (e) {
      if (!hasHitCircle(e, 0, -20, 16)) return;
      this.s = 1;
      reset();
      await wait(500);
      transition();
    },
    render: function () {
      ctx.strokeStyle = this.s ? '#fd9' : '#fff';
      drawTriangle(0, -20);
      drawText('You are lost', 'center', 0, 40);
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('Oh, you did that. Next time won’t be that easy!')
  }),
  d1,
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('Okay, it was literally just as easy. No more!')
  }),
  new Screen({
    init: function () {
      this.p = {x: 10, y: -20};
    },
    onmousemove: async function (e) {
      const {x, y} = getScreenPos(e);
      this.p = {x: -x, y: -y};
      if (Math.abs(this.p.x) < 1 && Math.abs(this.p.y) < 1) {
        this.p = {x: 0, y: 0};
        this.s = 1;
        reset();
        await wait(500);
        transition();
      } else {
        reset();
      }
    },
    render: function () {
      ctx.globalAlpha = .5;
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = this.s ? '#fd9' : '#fff';
      drawTriangle(0, -20);
      drawTriangle(this.p.x, this.p.y - 20);
      drawText('You are lost', 'center', 0, 40);
      drawText('You are lost', 'center', this.p.x, this.p.y + 40);
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('Finished already? Let’s see how you handle the next one.')
  }),
  new Screen({
    init: function () {
      this.a = 0;
      this.b = -2;
    },
    onclick: function (e) {
      if (!hasHitCircle(e, 0, -20, 16)) return;
      ++this.b;
      if (this.b == 30) {
        this.s = 1;
        this.a = 0;
        this.i = setInterval(async () => {
          this.a += 4;
          reset();
          if (this.a > 70) {
            clearInterval(this.i);
            this.s = 1;
            await wait(500);
            transition();
          }
        }, 33);
      }
      reset();
    },
    render: function () {
      if (this.s) drawTriangle(0, -20);
      ctx.strokeStyle = this.a ? `rgba(255,255,255,${(70-this.a)/70})` : '#fff';
      const x = Math.cos(1/3*Math.PI);
      const y = Math.sin(1/3*Math.PI);
      ctx.beginPath();
      ctx.moveTo(-12-this.a, -34);
      ctx.quadraticCurveTo(-12-this.b-this.a/2,-20,-12-this.a,-6);
      if (this.a) {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-12+x*this.a,-6+y*this.a);
      }
      ctx.quadraticCurveTo(x*(this.b+this.a/2),-13+y*(this.b+this.a/2),12+x*this.a,-20+y*this.a);
      if (this.a) {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(12+x*this.a,-20-y*this.a);
      }
      ctx.quadraticCurveTo(x*(this.b+this.a/2),-27-y*(this.b+this.a/2),-12+x*this.a,-34-y*this.a);
      ctx.stroke();
      drawText('You are lost', 'center', 0, 40);
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('That took a bit longer. Don’t let it drag you down. ;)')
  }),
  new Screen({
    init: function () {
      this.line = new Draggable(-40, -20, {
        isHit: function (e) {
          return hasHitCircle(e, this.x, this.y, 20);
        },
        move: function (pos) {
          this.x = pos.x + 10;
          clamp(this);
          if (Math.abs(this.x) < 2) {
            this.s = 1;
            this.x = 0;
          }
          reset();
        },
        render: function () {
          ctx.strokeStyle = this.s ? '#fd9' : '#fff';
          drawLine(this.x, this.y, [-12, -14, -12, 14]);
          const left = -ctx.measureText('You are lost').width / 2;
          drawText('You', 'left', left + this.x, 40);
          drawText('are lost', 'left', left + ctx.measureText('You ').width, 40);
        }
      });
    },
    onmouseup: async function () {
      if (this.line.s) {
        await wait(500);
        transition();
      }
    },
    render: function () {
      this.line.render();
      drawLine(0, -20, [-12, -14, 12, 0, -12, 14]);
    }
  }),
  new Screen({
    init: function () {
      this.d = 5;
      this.i = setInterval(() => {
        this.d = Math.min(this.d + 1, 999);
        reset();
      }, 33);
    },
    onclick: async function () {
      this.s = 1;
      await wait(500);
      clearInterval(this.i);
      transition();
    },
    render: function () {
      drawMessage('Let’s increase the difficulty a bit.');
      drawText('Difficulty: ' + this.d, 'left', -ctx.measureText('Difficulty: 999').width / 2, 70);
    },
  }),
  new Screen({
    init: function () {
      this.a = 1;
      this.text = '';
      this.i = setInterval(() => { this.a = !this.a; reset()}, 800);
    },
    onkeydown: async function (e) {
      if (e.keyCode == 8) {
        this.text = this.text.slice(0, -1);
        reset();
        return;
      }

      let letter = String.fromCharCode(e.keyCode).toLowerCase();
      if (letter != ' ' && (letter < 'a' || letter > 'z')) {
        return;
      }
      if (e.shiftKey) {
        letter = letter.toUpperCase();
      }
      this.text += letter;

      if (this.text == 'You are lost') {
        this.s = 1;
        this.a = 0;
        clearInterval(this.i);
        reset();
        await wait(500);
        transition();
        return;
      }

      reset();
    },
    render: function () {
      ctx.strokeStyle = this.s ? '#fd9' : '#fff';
      drawTriangle(0, -20);
      this.a && drawText('|', 'left', ctx.measureText(this.text).width - 90, 37);
      drawText(this.text, 'left', -88, 40);
    }
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('No, you are!')
  }),
  new Screen({
    init: function () {
      this._s = 5;
    },
    onkeydown: async function (e) {
      if (!isNaN(parseFloat(e.key))) {
        this._s = +e.key + 1;
      }
      if (e.key == '+' || e.key == 'ArrowUp') {
        ++this._s;
      }
      if (e.key == '-' || e.key == 'ArrowDown') {
        --this._s;
      }

      if (this._s == 1) {
        this.s = 1;
        reset();
        await wait(500);
        transition();
      } else {
        reset();
      }
    },
    render: function () {
      ctx.scale(this._s, this._s);
      ctx.strokeStyle = this.s ? '#fd9' : '#fff';
      drawTriangle(0, -20);
      drawText('You are lost', 'center', 0, 40);
    }
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('I’m excited. Aren’t you? Let’s see what’s next.')
  }),
  new Screen({
    init: function () {
      this.m = {x: 0, y: 200};
      this.r = .2;
    },
    onmousemove: function (e) {
      if (this.r > 50) return;
      this.m = getScreenPos(e);
      this.r *= 1.01;
      reset();
    },
    render: async function () {
      ctx.strokeStyle = '#fff';

      ctx.save();
      ctx.beginPath();
      this.addEyePath(-50,-15);
      ctx.clip();
      const rl = Math.atan2(15 + this.m.y, 50 + this.m.x);
      drawRing(-50 + Math.cos(rl) * this.r, -15 + Math.sin(rl) * this.r, 17);
      drawEllipse(-50 + Math.cos(rl) * this.r, -15 + Math.sin(rl) * this.r, 7);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      this.addEyePath(50,-15);
      ctx.clip();
      const rr = Math.atan2(15 + this.m.y, -50 + this.m.x);
      drawRing(50 + Math.cos(rr) * this.r, -15 + Math.sin(rr) * this.r, 17);
      drawEllipse(50 + Math.cos(rr) * this.r, -15 + Math.sin(rr) * this.r, 7);
      ctx.restore();

      ctx.beginPath();
      this.addEyePath(-50,-15);
      this.addEyePath(50,-15);
      ctx.stroke();
      drawText('You are lost', 'center', 0, 40);

      if (this.r > 50) {
        this.s = 1;
        ctx.strokeStyle = '#fd9';
        drawTriangle(0, -20);
        await wait(500);
        transition();
      }
    },
    addEyePath: function (x, y) {
      ctx.moveTo(x-30,y);
      ctx.quadraticCurveTo(x,y-30,x+30,y);
      ctx.quadraticCurveTo(x,y+30,x-30,y);
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('Do you get seasick?')
  }),
  new Screen({
    init: function () {
      this.t = this.u = 0;
      this.i = setInterval(() => { ++this.t; this.s && ++this.u; reset() }, 33);
    },
    onclick: async function(e) {
      if (!hasHitCircle(e, 240, 120, 20)) return;
      this.s = 1;
      await wait(2000);
      clearInterval(this.i);
      transition();
    },
    render: function () {
      const a = Math.sin(this.t / 24);
      const b = Math.sin((this.t + 6) / 24);
      const c = Math.sin(this.t / 30);
      ctx.save();
      ctx.rotate(c / 30 % 20);
      ctx.strokeStyle = this.s ? '#fd9' : '#fff';
      drawTriangle(0, -20 + a * 10 + this.u / 2);
      ctx.restore();
      ctx.save();
      ctx.rotate(c / 33 % 20);
      drawText('You are lost', 'center', 0, 40 + b * 11 + this.u / 2);
      ctx.restore();
      ctx.fillStyle = '#000';
      drawEllipse(120, 120, 20, 10);
      ctx.fillStyle = 'rgba(36,36,36,.7)';
      drawEllipse(120, 120 - this.u, 20, 10);
    }
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('I do. I’m glad that’s over.')
  }),
  new Screen({
    init: function () {
      this.d = [];
      for (let i=84;i--;) {
        this.d.push({
          x: i/83*(width-80)-width/2+20+Math.random()*20,
          y: 90 + Math.random() * 20,
          i
        });
      }
      this.t = new Draggable(-20, -20, {
        init: function () {
          this._s = [];
        },
        isHit: function (e) {
          return hasHitCircle(e, this.x, this.y, 20);
        },
        move: function (pos) {
          this.x = pos.x + 4;
          this.y = pos.y;
          clamp(this);
          reset();
        },
        render: function () {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          drawTriangle(this.x, this.y);
          ctx.fillStyle = '#fd9';
          this._s.forEach((_,i) => {
            let x, y;
            if (i < 28) {
              x = this.x - 12;
              y = this.y - 14 + +i;
            } else if (i < 56) {
              x = this.x - 12 + (i - 28) / 7 * 6;
              y = this.y - 14 + (i - 28) / 2;
            } else {
              x = this.x - 12 + (i - 56) / 7 * 6;
              y = this.y + 14 - (i - 56) / 2;
            }
            drawEllipse(x, y, 1.25);
          });
          ctx.fillStyle = '#fff';
        }
      });
    },
    onmouseup: async function () {
      if (this.t.s) {
        await wait(500);
        transition();
      }
    },
    render: async function () {
      this.t.render();
      drawText('You are lost', 'center', 0, 40);

      this.d = this.d.filter(d => {
        if (Math.hypot(this.t.x - d.x, this.t.y - d.y) < 10) {
          this.t._s[d.i] = 1;
          return 0;
        }
        ctx.fillStyle = 'rgba(255,221,153,.7)';
        drawEllipse(d.x, d.y, 1.25);
        return 1;
      });

      if (!this.d.length) {
        this.t.s = 1;
      }
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('What if I hid the triangle?')
  }),
  new Screen({
    init: function () {
      this.o = 0;
      this.first = 1;
      this.e = new Draggable(0, 34, {
        isHit: function (e) {
          return hasHitCircle(e, this.x, this.y, 10);
        },
        render: function () {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(.5);
          drawText('e', 'center', 0, 6);
          ctx.restore();
        },
        move: function (pos) {
          this.x = pos.x;
          this.y = pos.y;
          clamp(this);
          if (Math.hypot(this.x - 147, this.y - 14) < 4) {
            this.x = this.s = 147;
            this.y = 14;
          }

          reset();
        }
      });
    },
    onmouseup: function () {
      if (!this.e.s) return;
      const i = setInterval(async () => {
        this.o += 2;
        this.e.y += 2;
        reset();
        if (this.o == 240) {
          clearInterval(i);
          await wait(500);
          transition();
        }
      }, 33);
    },
    render: function () {
      const left = -ctx.measureText('You are lost').width / 2;
      if (this.first) {
        this.first = 0;
        this.e.x = left + ctx.measureText('You ar').width + ctx.measureText('e').width / 2;
      }

      ctx.save();
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 1.5;
      drawLine(-8,0,[0,-200,0,200-this.o]);
      drawLine(150,0,[0,-200,0,this.o]);
      ctx.beginPath();
      ctx.arc(150,5+this.o,5,Math.PI*3/2,2.5,0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-8,205-this.o,5,Math.PI*3/2,2.5,0);
      ctx.stroke();
      ctx.restore();

      drawTriangle(0, 220-this.o);

      drawText('You ar', 'left', left, 40);
      drawText('lost', 'left', left + ctx.measureText('You are ').width, 40);
      drawLine(0,-200,[0,0,10,0]);
      this.e.render();

      ctx.save();
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(150,5 + this.o,5,Math.PI/2,3,0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-8,205 - this.o,5,Math.PI/2,3,0);
      ctx.stroke();
      ctx.restore();
    }
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('Admit it, you’re hooked.')
  }),
  new Screen({
    init: function () {
      let o = this.o = [];

      class Line extends Draggable {
          constructor(x, y, i, g, methods) {
            super(x, y, methods);
            this.i = i;
            this.g = g;
          }

          isHit(e) {
            return hasHitCircle(e, this.x, this.y, 14);
          }

          move(pos) {
            this.x = pos.x;
            this.y = pos.y;
            clamp(this);
            if (Math.hypot(this.x - this.g.x, this.y - this.g.y) < 2) {
              this.s = 1;
              this.x = this.g.x;
              this.y = this.g.y;
              o.push(this.i);
            }
            reset();
          }
      }
      this.l = [
        new Line(80, -80, 3, {x: -12, y: -21}, {
          render: function () {
            ctx.strokeStyle = this.s ? '#fd9' : '#fff';
            drawLine(this.x, this.y, [0, -14, 0, 14]);
          }
        }),
        new Line(90, -50, 2, {x: 0, y: -13}, {
          render: function () {
            ctx.strokeStyle = this.s ? '#fd9' : '#fff';
            drawLine(this.x, this.y, [-12, 7, 12, -7]);
          }
        }),
        new Line(50, -70, 1, {x: 0, y: -28}, {
          render: function () {
            ctx.strokeStyle = this.s ? '#fd9' : '#fff';
            drawLine(this.x, this.y, [-12, -7, 12, 7]);
          }
        })
      ];
    },
    onclick: function (e) {
      if (this.a > 200) {
        const {x, y} = getScreenPos(e);
        if (x >= -70 && x <= 150 && y >= -50 && y <= -20) {
          clearInterval(this.i);
          transition();
        }
      }
    },
    onmouseup: async function () {
      if (this.o.join('') != '123') return;
      await wait(500);
      transition();
    },
    render: async function () {
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(0,0,0,.2)';
      ctx.shadowColor = 'transparent';
      drawTriangle(0, -20);
      ctx.restore();

      this.drawManual();
      this.l.sort((a, b) => (a === dragging) - (b === dragging));
      this.l.forEach(l => l.render());

      drawText('You are lost!', 'center', 0, 40);

      if (this.o.length == 3) {
        if (this.o.join('') == '123') {
          return;
        }

        this.o = [];
        this.a = 1;
        metDarkLord = 1;
        this.i = setInterval(reset, 33);
      }

      if (this.a) {
        this.drawDarkLord();
        if (this.a > 200) {
          this.drawClippy();
        }
      }
    },
    drawManual: function () {
      ctx.save();
      ctx.shadowColor = 'transparent';
      ctx.translate(-width / 2, -height / 2);
      const g = ctx.createLinearGradient(20, 20, 21, 190);
      g.addColorStop(.4, '#ccc');
      g.addColorStop(.5, '#aaa');
      g.addColorStop(.51, '#eee');
      g.addColorStop(0.6, '#ccc');
      ctx.fillStyle = g;
      ctx.fillRect(20, 20, 160, 180);
      ctx.fillStyle = ctx.strokeStyle = '#222';
      ctx.font = '10px ' + ctx.font.split(' ', 1)[1];
      const t = ['ASSEMBLY INSTRUCTIONS', '', '', '1.', '2.', '3.', '', 'NOTE: Assembling the object','in the wrong order will raise the','Dark Lord from His slumber.'];
      for (const i in t) {
        drawText(t[i], 'left', 35, 45 + i * 15);
      }
      ctx.lineWidth = 1;
      drawLine(54,86,[-3,-3.5,3,0]);
      drawLine(54,101,[-3,-3.5,3,0,-3,3.5]);
      drawPolygon(54,116,[-3,-3.5,3,0,-3,3.5]);
      ctx.restore();
    },
    drawDarkLord: function () {
      ctx.save();
      this.a = this.a ? this.a + 1 : 1;
      ctx.fillStyle = `rgba(0,0,0,${Math.min(this.a / 300,.3)+Math.sin(this.a)*.01})`;
      ctx.fillRect(-width / 2, -height / 2, width, height);

      ctx.translate(0, 150 - Math.min(this.a, 100));
      ctx.beginPath();
      ctx.moveTo(-110,130);
      ctx.quadraticCurveTo(-109,125,-100,110);
      ctx.quadraticCurveTo(-120,70,-100,0);
      ctx.quadraticCurveTo(-90,50,-70,70);

      ctx.quadraticCurveTo(0,50,70,70);
      ctx.quadraticCurveTo(90,50,100,0);
      ctx.quadraticCurveTo(120,70,100,110);
      ctx.quadraticCurveTo(109,125,110,130);

      ctx.translate(0, Math.max(100 - this.a, -80));
      ctx.moveTo(-10, 150);
      ctx.quadraticCurveTo(-5, 90, 0, 70);
      ctx.quadraticCurveTo(5, 90, 10, 150);
      ctx.fill();
      ctx.restore();
    },
    drawClippy: function () {
      ctx.beginPath();
      ctx.strokeStyle = '#ddd';
      ctx.translate(220,-20);
      ctx.moveTo(-24,-43);
      ctx.quadraticCurveTo(-24,-18,-16,-18);
      ctx.quadraticCurveTo(-8,-18,-8,-28);
      ctx.quadraticCurveTo(-10,-48,-6,-68);
      ctx.quadraticCurveTo(-6,-78,-14,-78);
      ctx.quadraticCurveTo(-31,-80,-28,-28);
      ctx.quadraticCurveTo(-26,0,-14,-2);
      ctx.quadraticCurveTo(0,-2,-2,-22);
      ctx.quadraticCurveTo(-4,-42,0,-44);
      ctx.stroke();
      drawEllipse(-7,-54,7,6);
      drawEllipse(-23,-58,7,6);
      ctx.fillStyle = '#333';
      ctx.shadowColor = 'transparent';
      drawEllipse(-7,-54,3.5,3);
      drawEllipse(-23,-58,3.5,3);
      ctx.strokeStyle = '#444';
      ctx.shadowColor = 'rgba(0,0,0,.5)';
      ctx.beginPath();
      ctx.moveTo(-32,-65);
      ctx.quadraticCurveTo(-28,-69,-21,-68);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-8,-65);
      ctx.quadraticCurveTo(-4,-64,0,-60);
      ctx.stroke();

      ctx.fillStyle = '#fea';
      ctx.fillRect(-300,-120,240,130);
      ctx.shadowColor = 'transparent';
      ctx.strokeRect(-300,-120,240,130);
      fillPolygon(-62, -40, [0,0,0,-10,20,-2]);
      drawLine(-60, -40, [0,0,20,-2,0,-10]);

      ctx.fillStyle = '#000';
      ctx.font = '16px Arial, sans-serif';
      drawText('It looks like you’ve summoned', 'left', -290, -90);
      drawText('the Dark Lord. Do you need', 'left', -290, -70);
      drawText('assistance?', 'left', -290, -50);
      drawText('Yes', 'left', -270, -10);
      drawText('Duh', 'right', -90, -10);
      ctx.strokeStyle = 'rgba(200,200,200,.7)';
      ctx.strokeRect(-290,-30,40 + ctx.measureText('Yes').width,30);
      ctx.strokeRect(-110 - ctx.measureText('Duh').width,-30,40 + ctx.measureText('Duh').width,30);
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage(metDarkLord ? '…' : 'I never read the instructions.')
  }),
  new Screen({
    init: function () {
      this.m = {x: 0, y: 0, t: 0};
      this.r = [];
      this.c = 0;
      this.i = setInterval(() => {
        this.r = this.r.filter(r => {
          r.r += .1;
          return r.r < r.s * 2;
        });
        reset();
      }, 33);
    },
    onmousemove: async function (e) {
      const {x, y} = getScreenPos(e);

      if (Math.hypot(x, y + 20) <= 16 && Math.hypot(this.m.x, this.m.y + 20) > 16) {
        const s = Math.hypot(x - this.m.x, y - this.m.y) / (+new Date() - this.m.t);
        ++this.c;
        this.r.push({r: 1, s: s + 1});
        if (s > 3 || this.c == 30) {
          this.s = 1;
          await wait(500);
          clearInterval(this.i);
          transition();
        }
      }

      this.m = {x, y, t: +new Date()};
    },
    render: function () {
      this.r.forEach(r => {
          ctx.save();
          ctx.strokeStyle = `rgba(255,255,255,${(1-r.r/r.s)*.5})`;
          ctx.translate(0, -20);
          ctx.scale(r.r, r.r);
          drawLine(0, 0, [-12, 8, -12, -14, 12, 0, -7, 11]);
          ctx.restore();
      });
      ctx.strokeStyle = this.s ? '#fd9' : '#fff';
      drawLine(0, -20, [-12, 8, -12, -14, 12, 0, -7, 11]);
      drawText('You are lost', 'center', 0, 40);
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage(metDarkLord ? 'One more hit would’ve summoned the Dark Lord again.' : 'Ding ding ding.')
  }),
  new Screen({
    init: function () {
      this.r = [];
      this._s = [];
      this.i = setInterval(() => {
        for (let i = 3; i--;) {
          this.r.push({
            x: Math.random() * 640 - 320,
            y: -200,
            sx: -.6 - Math.random() * .6,
            sy: 12
          });
        }
        this.r = this.r.filter(r => {
          r.x += r.sx;
          r.y += r.sy;

          if (r.y >= 4 && r.y < 4 + 12 && Math.abs(r.x) < ctx.measureText('You are lost').width / 2 && Math.random() < .9) {
            this._s.push({x: r.x, y: 24, r: 1});
            return 0;
          }

          if (r.y >= -70 && r.y < -70 + 12 && r.x >= -170 && r.x <= -145) {
            this._s.push({x: r.x, y: -65 + (r.x + 170) / 2, r: 1});
            return 0;
          }

          return r.y < 200;
        });
        this._s = this._s.filter(s => {
          s.r += .5;
          return s.r < 5;
        });
        reset();
      }, 33);
    },
    onclick: async function (e) {
      if (hasHitCircle(e, -160, -50, 16)) {
        this.s = 1;
        await wait(500);
        clearInterval(this.i);
        transition();
        reset();
      }
    },
    render: function () {
        if (this.s) drawTriangle(-160, -50);
        drawText('You are lost', 'center', 0, 40);
        ctx.strokeStyle = 'rgba(255,255,255,.2)';
        ctx.lineWidth = 1;
        this.r.forEach(r => {
          drawLine(r.x,r.y,[0,0,r.sx*2,r.sy*2]);
        });
        ctx.strokeStyle = 'rgba(255,255,255,.05)';
        this._s.forEach(s => {
          drawRing(s.x,s.y,s.r);
        });
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('I didn’t see that coming.')
  }),
  new Screen({
    init: function () {
      this.a = -1 / 6 * Math.PI;
      this.ai = 0;
      this.at = 100;
      this.p = [50, 180, 50 + Math.cos(this.a)*50, 180 + Math.sin(this.a)*50];
      this.i = setInterval(async () => {
        const i = 2 + this.ai * 2;
        ++this.at;
        if (this.at <= 100) {
          this.a -= 2 / 3 * Math.PI / 100;
        } else {
          this.p[i] += Math.cos(this.a) * .5;
          this.p[i + 1] += Math.sin(this.a) * .5;
        }
        if (this.ai == 0 && this.p[i] > 250 ||
            this.ai == 1 && this.p[i] < 80) {
          this.changeDir();
        }
        if (this.ai == 2 && (this.p[i + 1] - 180) >= Math.tan(-1/6*Math.PI) * (this.p[i] - 50)) {
          this.s = 1;
          clearInterval(this.i);
          reset();
          await wait(500);
          transition();
        } else {
          reset();
        }
      }, 33);
    },
    onclick: function (e) {
      if (this.ai == 2 || this.at < 130) return;
      const x = this.p[2 + this.ai * 2] + Math.cos(this.a) * 28;
      const y = this.p[3 + this.ai * 2] + Math.sin(this.a) * 28;

      if (hasHitCircle(e, x, y, 30)) {
        this.changeDir();
      }
    },
    render: function () {
      drawText('You are lost', 'center', 0, 40);
      ctx.strokeStyle = '#fff';
      if (this.s) {
        drawLine(0, 0, this.p.slice(0, 2).concat(this.p.slice(6, 8)));
        ctx.strokeStyle = '#fd9';
        drawPolygon(0, 0, this.p.slice(2));
      } else {
        drawLine(0, 0, this.p);
      }
      this.drawSnail();
    },
    changeDir: function () {
      this.p.push(this.p[2 + this.ai * 2], this.p[3 + this.ai * 2]);
      this.at = 0;
      ++this.ai;
    },
    drawSnail: function () {
      ctx.save();
      ctx.strokeStyle = '#fff';
      ctx.translate(...this.p.slice(-2));
      ctx.rotate(this.a);
      ctx.beginPath();
      ctx.moveTo(12, -5);
      ctx.quadraticCurveTo(6, -4, 0, 0);
      ctx.lineTo(30, 0);
      ctx.quadraticCurveTo(35, 0, 40, -2);
      ctx.quadraticCurveTo(45, -4, 50, -4);
      ctx.quadraticCurveTo(52.5, -3, 56, -4);
      ctx.quadraticCurveTo(57, -5, 56, -12);
      ctx.quadraticCurveTo(53, -15, 40, -12);
      ctx.quadraticCurveTo(30, -3, 12, -5);
      ctx.quadraticCurveTo(9, -10, 12, -15);
      ctx.quadraticCurveTo(22, -16, 32, -19);
      ctx.quadraticCurveTo(39, -18, 40, -12);
      ctx.moveTo(32, -19);
      ctx.quadraticCurveTo(30, -27, 16, -23);
      ctx.quadraticCurveTo(11, -20, 12, -15);
      ctx.moveTo(15, -22);
      ctx.quadraticCurveTo(18,-32,27,-24);

      ctx.moveTo(55, -12);
      ctx.lineTo(58, -22);
      ctx.moveTo(55, -12);
      ctx.lineTo(64, -14);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.stroke();

      drawEllipse(58, -22, 1.7);
      drawEllipse(64, -14, 1.7);
      ctx.restore();
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('So cute.')
  }),
  new Screen({
    init: function () {
      this.n = [];
      for (let i = 8; i--;) {
        this.n.push({x: (i/7)*400-250+Math.random()*100, y: -10+Math.random()*20, m: .5 + Math.random() / 2})
      }
      this.n.sort((a, b) => a.m - b.m);
      this.i = setInterval(() => {
        this.n.forEach(n => n.m += Math.max(1.5 - n.m, 0) / 60);
        reset();
      }, 33);
    },
    onclick: async function (e) {
      const {x, y} = getScreenPos(e);
      this.n = this.n.filter(n => {
        if (Math.abs(n.x - x) < (1+n.m) * 25 && Math.abs(n.y - y) < (1+n.m) * 40) {
          n.m = Math.max(n.m - .3 - Math.random() * .7, 0);
          n.h = 20;
        }
        return n.m;
      });
      this.n.sort((a, b) => a.m - b.m);
      if (!this.n.length) {
        this.s = 1;
        await wait(1000);
        transition();
      }
    },
    render: function () {
      ctx.strokeStyle = this.n.length ? '#fff' : '#fd9';
      drawTriangle(0, -20);
      drawText('You are lost', 'center', 0, 40);

      for (const n of this.n) {
        n.h = Math.max(0, n.h - 1);

        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.scale(1+n.m,2*(1+n.m));

        const gradient = ctx.createRadialGradient(0, -10, 90, 0, -20, 0);
        gradient.addColorStop(1, `rgb(${50+n.m*150|0},${50+n.m*150|0},${50+n.m*150|0})`);
        gradient.addColorStop(0, `rgb(${50+n.m*50|0},${50+n.m*50|0},${50+n.m*50|0})`);
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(16,6);
        ctx.quadraticCurveTo(16,2,12,2);
        ctx.lineTo(-12,2);
        ctx.quadraticCurveTo(-16,2,-16,6);
        ctx.lineTo(-17,12);
        ctx.lineTo(-15,13);
        ctx.lineTo(-18,20);
        ctx.quadraticCurveTo(0,23,18,20);
        ctx.lineTo(18,20);
        ctx.lineTo(15,13);
        ctx.lineTo(17,12);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0,-20);
        ctx.lineTo(-12,4);
        ctx.quadraticCurveTo(0,5,12,4);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.shadowColor = 'transparent';
        ctx.translate(0, -4);
        ctx.scale(1,n.h?.1:.3);
        ctx.fillText('.', 3, 0);
        ctx.fillText('.', -3, 0);

        ctx.restore();
      }
    }
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('Thanks for punching those Nazis. I like you. :)')
  }),
  new Screen({
    render: () => {
      drawPolygon(0, -20, [-14, -14, -14, 14, 14, 14, 14, -14]);
      drawText('You are no longer lost', 'center', 0, 40);
    }
  })
];
