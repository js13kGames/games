function createGui({ buildings }) {
    const messagesEl = document.querySelector('.messages');
    const gui = {
        clearMessages() {
            messagesEl.innerHTML = '';
        },
        message(s) {
            const el = $('div');
            el.innerText = s;
            messagesEl.append(el);
        },
        mode: 'inspect',
    };
    Object.keys(buildings).concat(/*'inspect', 'destroy',*/ 'pause', 'buy land').forEach((key) => {
        const el = $('button');
        el.innerText = key;
        el.className = gui.mode == key? 'active' : '';
        el.addEventListener('click', () => {
            gui.mode = key;
            menuEl.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            el.classList.add('active');
        });
        menuEl.append(el);
    });
    return gui;
}
