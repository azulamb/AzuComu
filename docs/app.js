((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => { init(script); });
})(document.currentScript, (script) => {
    ((component, tagname = 'file-area') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML =
                [
                    ':host { display: block; background: aqua; --cursor: pointer; --border: transparent; }',
                    ':host > label { display: block; width: 100%; height: 100%; overflow: hidden; cursor: var( --cursor ); box-sizing: border-box; border: var( --border ); }',
                    'input { display: none; }',
                    ':host > div { display: none; overflow: hidden; }',
                    ':host( [loading] ) > label, :host( [loaded] ) > label { display: none; }',
                    ':host( [loading] ) > div, :host( [loaded] ) > div { display: block; width: 100%; height: 100%; }',
                    '.hover { display: none; }',
                    ':host( :hover ) .hover, .label { display: block; width: 100%; height: 100%; background: rgba( 0, 0, 0, 0.5 ); position: absolute; top: 0; left: 0; pointer-events: none; display: flex; justify-content: center; align-items: center; text-align: center; }',
                    'label .label::before { content: "ファイル選択"; color: white; }',
                    ':host( [loading] ) > div .hover::before { content: "読込中"; color: white; }',
                    ':host( [loaded] ) > div .hover::before { content: "編集"; color: white; }',
                ].join('');
            this.file = document.createElement('input');
            this.file.type = 'file';
            this.file.id = 'file';
            this.file.addEventListener('change', (event) => {
                if (!this.file.files) {
                    return;
                }
                this.onDrop(this.file.files[0]);
            });
            const labelFle = document.createElement('div');
            labelFle.classList.add('label');
            const label = document.createElement('label');
            label.setAttribute('for', 'file');
            label.appendChild(this.file);
            label.appendChild(labelFle);
            label.addEventListener('dragover', (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (event.dataTransfer) {
                    event.dataTransfer.dropEffect = 'copy';
                }
            });
            label.addEventListener('drop', (event) => {
                event.stopPropagation();
                event.preventDefault();
                const dataTransfer = event.dataTransfer;
                if (!dataTransfer) {
                    return;
                }
                const files = dataTransfer.files;
                if (files.length < 1) {
                    return;
                }
                const file = files[0];
                this.onDrop(file);
            });
            const labelLoading = document.createElement('div');
            labelLoading.classList.add('hover');
            const components = document.createElement('div');
            components.appendChild(document.createElement('slot'));
            components.appendChild(labelLoading);
            shadow.appendChild(style);
            shadow.appendChild(label);
            shadow.appendChild(components);
        }
        onDrop(file) {
            this.dispatchEvent(new CustomEvent('dropfile', { detail: { file: file } }));
        }
        get accept() { return this.file.accept; }
        set accept(value) { this.setAttribute('accept', value + ''); }
        get loading() { return this.hasAttribute('loading'); }
        set loading(value) {
            if (!value) {
                this.removeAttribute('loading');
            }
            else {
                this.setAttribute('loading', '');
                this.loaded = false;
            }
        }
        get loaded() { return this.hasAttribute('loaded'); }
        set loaded(value) {
            if (!value) {
                this.removeAttribute('loaded');
            }
            else {
                this.setAttribute('loaded', '');
                this.loading = false;
            }
        }
        reset() {
            this.file.value = '';
        }
        static get observedAttributes() { return ['accept']; }
        attributeChangedCallback(attrName, oldVal, newVal) {
            if (oldVal === newVal) {
                return;
            }
            this.file.accept = newVal;
        }
    }, script.dataset.tagname);
});
((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => { init(script); });
})(document.currentScript, (script) => {
    ((component, tagname = 'triming-button') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML =
                [
                    ':host { display: block; width: 100%; height: 100%; }',
                    ':host > div { display: block; width: 100%; height: 100%; position: relative; }',
                    'button { display: block; cursor: pointer; border: none; background: none; position: absolute; box-sizing: border: none; padding: 0; }',
                    '#main { width: 100%; height: 100%; top: 0; left: 0; }',
                    '#close { width: 2rem; height: 2rem; top: 0.5rem; right: 0.5rem; }',
                    '#close::before { display: inline; content: "×"; line-height: 2rem; font-size: 2rem; }',
                ].join('');
            const main = document.createElement('button');
            main.id = 'main';
            main.addEventListener('click', (event) => {
                event.stopPropagation();
                this.dispatchEvent(new CustomEvent('main'));
            });
            const close = document.createElement('button');
            close.id = 'close';
            close.addEventListener('click', (event) => {
                event.stopPropagation();
                this.dispatchEvent(new CustomEvent('close'));
            });
            const components = document.createElement('div');
            components.appendChild(main);
            components.appendChild(close);
            shadow.appendChild(style);
            shadow.appendChild(components);
        }
        get sw() { return parseInt(this.getAttribute('sw') || '') || 0; }
        set sw(value) { this.setAttribute('sw', value + ''); }
        get sh() { return parseInt(this.getAttribute('sh') || '') || 0; }
        set sh(value) { this.setAttribute('sh', value + ''); }
        get sx() { return parseInt(this.getAttribute('sx') || '') || 0; }
        set sx(value) { this.setAttribute('sx', value + ''); }
        get sy() { return parseInt(this.getAttribute('sy') || '') || 0; }
        set sy(value) { this.setAttribute('sy', value + ''); }
        get dw() { return parseInt(this.getAttribute('dw') || '') || 0; }
        set dw(value) { this.setAttribute('dw', value + ''); }
        get dh() { return parseInt(this.getAttribute('dh') || '') || 0; }
        set dh(value) { this.setAttribute('dh', value + ''); }
        get dx() { return parseInt(this.getAttribute('dx') || '') || 0; }
        set dx(value) { this.setAttribute('dx', value + ''); }
        get dy() { return parseInt(this.getAttribute('dy') || '') || 0; }
        set dy(value) { this.setAttribute('dy', value + ''); }
    }, script.dataset.tagname);
});
((script, init) => {
    Promise.all([
        customElements.whenDefined('file-area'),
        customElements.whenDefined('triming-button'),
    ]).then(() => { init(script); });
})(document.currentScript, (script) => {
    const SERVERS = [
        '',
        'ブレスト',
        '横須賀',
        'トラック',
        '佐世保',
        'サモア',
        '呉',
        'ルルイエ',
        '舞鶴',
        'ラバウル',
        '大湊',
        'サンディエゴ',
        '鹿児島',
        'マドラス',
        '竹敷',
        'キール',
        '若松',
        'オデッサ',
    ];
    ((component, tagname = 'profile-area') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        constructor() {
            super();
            this.imgs = {};
            this.triming = {};
            this.commander = '';
            this.server = '';
            this.year = '';
            this.month = '';
            this.day = '';
            this.comment = '';
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML =
                [
                    ':host { display: block; width: 100%; height: 100%; }',
                    ':host > div { width: 100%; height: 100%; position: relative; }',
                    ':host > div > footer { position: absolute; bottom: 0.1rem; left: 0; width: 50%; display: grid; grid-template-columns: 50% 50%; }',
                    ':host > div > footer > button { font-size: 1rem; cursor: pointer; background: #8cf5eb; border: none; border-radius: 0.2rem; margin: 0 0.1rem; }',
                    ':host > div > footer > button.preview::before { content: "プレビュー"; }',
                    ':host > div > footer > button.download::before { content: "ダウンロード"; }',
                    ':host > div > div { width: min( 100vw, calc( ( 100vh - 2rem ) * 900 / 506 ) ); overflow: hidden; position: relative; margin: auto; }',
                    ':host > div > div > img { opacity: 0; display: block; width: 100%; }',
                    ':host > div > div > canvas { display: block; width: 100%; top: 0; left: 0; position: absolute; }',
                    'file-area { position: absolute; display: block; background: transparent; --border: 4px solid aqua; }',
                    '#main { width: 62.5%; height: 94.5%; top: 2.8%; left: 1.5%; }',
                    '.wife { position: absolute; display: block; width: 11%; height: 25%; }',
                    '.wife > file-area { width: 100%; height: 100%; overflow: hidden; }',
                    '#wife0 { top: 44%; left: 64.5%; }',
                    '#wife1 { top: 44%; left: 75.7%; }',
                    '#wife2 { top: 44%; left: 87%; }',
                    '.input { display: grid; position: absolute; }',
                    '.commander { top: 5%; left: 77%; width: 21%; height: 6%; }',
                    '.server { top: 15%; left: 77%; width: 21%; height: 6%; }',
                    '.begin { top: 25.5%; left: 77%; width: 21%; height: 6%; grid-template-columns: 40% 30% 30%; }',
                    '.comment { top: 78.5%; left: 64%; width: 34%; height: 18.5%; }',
                    '.comment textarea { font-size: 100%; }',
                    ':host( [preview] ) > div > div :not( canvas ):not( img ) { display: none; }',
                ].join('');
            this.canvas = document.createElement('canvas');
            this.frame = document.createElement('img');
            this.frame.onload = () => {
                this.canvas.width = this.frame.naturalWidth;
                this.canvas.height = this.frame.naturalHeight;
                this.updateImage();
            };
            this.frame.src = './frame.png';
            const contents = document.createElement('div');
            contents.appendChild(this.createInput());
            contents.appendChild(this.createFooter());
            shadow.appendChild(style);
            shadow.appendChild(contents);
        }
        createInput() {
            this.triming.main = new (customElements.get('triming-button'))();
            this.triming.main.sw = 562;
            this.triming.main.sh = 480;
            this.triming.main.dx = 13;
            this.triming.main.dy = 13;
            this.triming.main.dw = 562;
            this.triming.main.dh = 480;
            this.triming.main.addEventListener('close', () => {
                main.loaded = false;
                delete this.imgs.main;
                this.updateImage();
                main.reset();
            });
            this.triming.main.addEventListener('main', () => {
                if (!this.imgs.main) {
                    return;
                }
                this.onEdit(this.triming.main, this.imgs.main);
            });
            const main = new (customElements.get('file-area'))();
            main.id = 'main';
            main.accept = 'image/*';
            main.appendChild(this.triming.main);
            main.addEventListener('dropfile', (event) => {
                main.loading = true;
                this.loadImage('main', event.detail.file, main);
            });
            const wifes = [];
            for (let i = 0; i < 3; ++i) {
                const key = `wife${i}`;
                const triming = new (customElements.get('triming-button'))();
                this.triming[key] = triming;
                triming.dx = 581 + i * 101 + (i === 1 ? 1 : 0);
                triming.dy = 223;
                triming.dw = 97;
                triming.dh = 126;
                triming.sw = 97;
                triming.sh = 126;
                triming.addEventListener('close', () => {
                    wife.loaded = false;
                    delete this.imgs[key];
                    this.updateImage();
                });
                triming.addEventListener('main', () => {
                    const img = this.imgs[key];
                    if (!img) {
                        return;
                    }
                    this.onEdit(triming, img);
                });
                const wife = new (customElements.get('file-area'))();
                wife.accept = 'image/*';
                wife.appendChild(this.triming[key]);
                wife.addEventListener('dropfile', (event) => {
                    wife.loading = true;
                    this.loadImage(`wife${i}`, event.detail.file, wife);
                });
                const block = document.createElement('div');
                block.id = `wife${i}`;
                block.classList.add('wife');
                block.appendChild(wife);
                wifes.push(block);
            }
            const wrapper = document.createElement('div');
            wrapper.appendChild(this.frame);
            wrapper.appendChild(this.canvas);
            wrapper.appendChild(main);
            for (const wife of wifes) {
                wrapper.appendChild(wife);
            }
            wrapper.appendChild(this.createCommander());
            wrapper.appendChild(this.createServer());
            wrapper.appendChild(this.createBegin());
            wrapper.appendChild(this.createComment());
            return wrapper;
        }
        createCommander() {
            const name = document.createElement('input');
            name.addEventListener('blur', () => {
                this.commander = name.value;
                this.updateImage();
            });
            const commander = document.createElement('div');
            commander.classList.add('input', 'commander');
            commander.appendChild(name);
            return commander;
        }
        createServer() {
            const select = document.createElement('select');
            select.addEventListener('change', () => {
                this.server = SERVERS[select.selectedIndex];
                this.updateImage();
            });
            SERVERS.forEach((name) => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
            const server = document.createElement('div');
            server.classList.add('input', 'server');
            server.appendChild(select);
            return server;
        }
        createBegin() {
            const now = new Date();
            const year = document.createElement('select');
            year.addEventListener('change', () => {
                this.year = year.selectedOptions[0].value;
                this.updateImage();
            });
            year.appendChild(document.createElement('option'));
            for (let y = 2017; y <= now.getFullYear(); ++y) {
                const option = document.createElement('option');
                option.value = y + '';
                option.textContent = option.value;
                year.appendChild(option);
            }
            const month = document.createElement('select');
            month.addEventListener('change', () => {
                this.month = month.selectedOptions[0].value;
                this.updateImage();
            });
            month.appendChild(document.createElement('option'));
            for (let m = 1; m <= 12; ++m) {
                const option = document.createElement('option');
                option.value = m + '';
                option.textContent = option.value;
                month.appendChild(option);
            }
            const day = document.createElement('select');
            day.appendChild(document.createElement('option'));
            day.addEventListener('change', () => {
                this.day = day.selectedOptions[0].value;
                this.updateImage();
            });
            for (let d = 1; d <= 31; ++d) {
                const option = document.createElement('option');
                option.value = d + '';
                option.textContent = option.value;
                day.appendChild(option);
            }
            const begin = document.createElement('div');
            begin.classList.add('input', 'begin');
            begin.appendChild(year);
            begin.appendChild(month);
            begin.appendChild(day);
            return begin;
        }
        createComment() {
            const text = document.createElement('textarea');
            text.addEventListener('blur', () => {
                this.comment = text.value;
                this.updateImage();
            });
            const comment = document.createElement('div');
            comment.classList.add('input', 'comment');
            comment.appendChild(text);
            return comment;
        }
        createFooter() {
            const preview = document.createElement('button');
            preview.classList.add('preview');
            preview.addEventListener('click', (event) => {
                event.stopPropagation();
                this.preview = !this.preview;
            });
            const download = document.createElement('button');
            download.classList.add('download');
            download.addEventListener('click', (event) => {
                event.stopPropagation();
                const link = document.createElement('a');
                link.download = 'azucomm_profile.png';
                link.href = this.canvas.toDataURL();
                link.click();
            });
            const footer = document.createElement('footer');
            footer.appendChild(preview);
            footer.appendChild(download);
            return footer;
        }
        drawText(context, x, y, width, height, text) {
            context.textBaseline = 'middle';
            context.font = 'bold 26px i-rounded';
            context.fillStyle = 'white';
            context.strokeStyle = '#515151';
            context.lineWidth = 4;
            const texts = text.split(/\r\n|\n|\r/);
            const w = texts.map((text) => {
                return context.measureText(text).width + 4;
            }).reduce((prev, now) => { return prev < now ? now : prev; }, 0);
            const h = texts.length * 40;
            if (width < w) {
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = Math.max(h, height);
                const ctx = canvas.getContext('2d');
                ctx.textBaseline = 'middle';
                ctx.font = 'bold 26px i-rounded';
                ctx.fillStyle = 'white';
                ctx.strokeStyle = '#515151';
                ctx.lineWidth = 4;
                for (let i = 0; i < texts.length; ++i) {
                    ctx.strokeText(texts[i], 2, 20 + i * 40);
                    ctx.fillText(texts[i], 2, 20 + i * 40);
                }
                context.drawImage(canvas, x, y, width, height);
            }
            else {
                context.strokeText(text, x, y + 20);
                context.fillText(text, x, y + 20);
            }
        }
        updateImage() {
            const context = this.canvas.getContext('2d');
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.imgs.main) {
                context.drawImage(this.imgs.main, this.triming.main.sx, this.triming.main.sy, this.triming.main.sw, this.triming.main.sh, this.triming.main.dx, this.triming.main.dy, this.triming.main.dw, this.triming.main.dh);
            }
            if (this.imgs.wife0) {
                const wife = this.triming.wife0;
                context.drawImage(this.imgs.wife0, wife.sx, wife.sy, wife.sw, wife.sh, wife.dx, wife.dy, wife.dw, wife.dh);
            }
            if (this.imgs.wife1) {
                const wife = this.triming.wife1;
                context.drawImage(this.imgs.wife1, wife.sx, wife.sy, wife.sw, wife.sh, wife.dx, wife.dy, wife.dw, wife.dh);
            }
            if (this.imgs.wife2) {
                const wife = this.triming.wife2;
                context.drawImage(this.imgs.wife2, wife.sx, wife.sy, wife.sw, wife.sh, wife.dx, wife.dy, wife.dw, wife.dh);
            }
            context.drawImage(this.frame, 0, 0);
            this.drawText(context, 700, 20, 185, 40, this.commander);
            this.drawText(context, 700, 73, 185, 40, this.server);
            const date = [this.year];
            if (this.month) {
                date.push(this.month);
                if (this.day) {
                    date.push(this.day);
                }
            }
            this.drawText(context, 700, 125, 185, 40, date.join('/'));
            this.drawText(context, 577, 395, 308, 95, this.comment);
        }
        loadImage(key, file, filearea) {
            delete this.imgs[key];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                const image = document.createElement('img');
                image.onload = () => {
                    this.imgs[key] = image;
                    this.updateImage();
                    filearea.loaded = true;
                };
                image.src = reader.result;
            }, false);
            reader.readAsDataURL(file);
        }
        onEdit(triming, image) {
            const detail = {
                triming: triming,
                image: image,
            };
            this.dispatchEvent(new CustomEvent('edit', {
                detail: detail,
            }));
        }
        get preview() { return this.hasAttribute('preview'); }
        set preview(value) { if (!value) {
            this.removeAttribute('preview');
        }
        else {
            this.setAttribute('preview', '');
        } }
    }, script.dataset.tagname);
});
((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => { init(script); });
})(document.currentScript, (script) => {
    const DEFALUT_DISTANCE = 40;
    ((component, tagname = 'triming-area') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        constructor() {
            super();
            this.params = {
                x: 0, y: 0, X: 0, Y: 0, sx: 0, sy: 0,
            };
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML =
                [
                    ':host { display: none; width: 100%; height: 100%; top: 0; left: 0; position: absolute; background: rgba( 0, 0, 0, 0.8 ); overflow: hidden; --button-text: "Complete"; --button-border: none; --button-size: 1rem; --button-back: lightgray; --button-radius: 0.2rem; }',
                    ':host( [show] ) { display: block; }',
                    ':host > div { display: block; width: 100%; height: 100%; box-sizing: border-box; padding: 1rem; }',
                    ':host > div > div { display: grid; grid-template-columns: 100%; grid-template-rows: calc(100% - 2rem) 2rem; width: 100%; height: 100%; }',
                    '.main { position: relative; }',
                    '.dragarea { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }',
                    'canvas { object-fit: contain; width: 100%; height: 100%; /*pointer-events: none; user-select: none; user-drag: none;*/ }',
                    'button { cursor: pointer; border: var( --button-border ); font-size: var( --button-size ); background: var( --button-back ); border-radius: var( --button-radius ); }',
                    'button::before { content: var( --button-text ); }',
                ].join('');
            this.canvas = document.createElement('canvas');
            const dragarea = document.createElement('div');
            dragarea.classList.add('dragarea');
            this.initMove(dragarea);
            const main = document.createElement('div');
            main.classList.add('main');
            main.draggable = false;
            main.appendChild(this.canvas);
            main.appendChild(dragarea);
            const complete = document.createElement('button');
            complete.addEventListener('click', () => {
                this.x = this.params.x;
                this.y = this.params.y;
                this.w = this.params.X - this.params.x;
                this.h = this.params.Y - this.params.y;
                this.dispatchEvent(new CustomEvent('change'));
            });
            const sub = document.createElement('div');
            sub.classList.add('sub');
            sub.appendChild(complete);
            const area = document.createElement('div');
            area.appendChild(main);
            area.appendChild(sub);
            const components = document.createElement('div');
            components.addEventListener('click', (event) => {
                event.stopPropagation();
            });
            components.appendChild(area);
            shadow.appendChild(style);
            shadow.appendChild(components);
        }
        getPos(clickX, clickY, parentWidth, parentHeight) {
            const diff = (this.canvas.width / this.canvas.height < parentWidth / parentHeight) ?
                {
                    w: parentWidth - this.canvas.width * parentHeight / this.canvas.height,
                    h: 0,
                } :
                {
                    w: 0,
                    h: parentHeight - this.canvas.height * parentWidth / this.canvas.width,
                };
            const w = this.canvas.width / (parentWidth - diff.w);
            const h = this.canvas.height / (parentHeight - diff.h);
            const x = Math.floor((clickX - diff.w / 2) * w);
            const y = Math.floor((clickY - diff.h / 2) * h);
            return [x, y];
        }
        initMove(dragarea) {
            let onmove = null;
            let touchMode = false;
            const getSelectPosition = (event) => {
                if (event.offsetX !== undefined) {
                    return {
                        x: event.offsetX,
                        y: event.offsetY,
                    };
                }
                const touch = event.changedTouches[0];
                const bounds = dragarea.getBoundingClientRect();
                return {
                    x: touch.clientX - bounds.left,
                    y: touch.clientY - bounds.top,
                };
            };
            const begin = (position) => {
                if (onmove) {
                    dragarea.removeEventListener('mousemove', onmove);
                    onmove = null;
                }
                const [x, y] = this.getPos(position.x, position.y, dragarea.offsetWidth, dragarea.offsetHeight);
                const pos = [
                    { type: 1, length: 0, x: this.params.x, y: this.params.y },
                    { type: 2, length: 0, x: this.params.X, y: this.params.y },
                    { type: 3, length: 0, x: this.params.x, y: this.params.Y },
                    { type: 4, length: 0, x: this.params.X, y: this.params.Y },
                ].map((data) => {
                    const a = data.x - x;
                    const b = data.y - y;
                    data.length = a * a + b * b;
                    return data;
                }).sort((a, b) => {
                    return a.length - b.length;
                })[0];
                const dis = this.distance;
                const outPoint = dis * dis + dis * dis < pos.length;
                const outBox = x < this.params.x || this.params.X < x || y < this.params.y || this.params.Y < y;
                if (outPoint && outBox) {
                    return -1;
                }
                if (outPoint && !outBox) {
                    pos.type = 0;
                }
                this.params.sx = x;
                this.params.sy = y;
                return pos.type;
            };
            const end = () => {
                touchMode = false;
                if (onmove) {
                    dragarea.removeEventListener('mousemove', onmove);
                    dragarea.removeEventListener('touchmove', onmove);
                    onmove = null;
                }
            };
            dragarea.addEventListener('touchstart', (event) => {
                touchMode = true;
                const position = getSelectPosition(event);
                const type = begin(position);
                if (type < 0) {
                    return;
                }
                onmove = (event) => {
                    const position = getSelectPosition(event);
                    this.onMove(position, dragarea, type);
                };
                dragarea.addEventListener('touchmove', onmove);
                this.onMove(position, dragarea, type);
            });
            dragarea.addEventListener('touchend', end);
            dragarea.addEventListener('mousedown', (event) => {
                if (touchMode) {
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
                const position = getSelectPosition(event);
                const type = begin(position);
                if (type < 0) {
                    return;
                }
                onmove = (event) => {
                    const position = getSelectPosition(event);
                    this.onMove(position, dragarea, type);
                };
                dragarea.addEventListener('mousemove', onmove);
                this.onMove(position, dragarea, type);
            });
            dragarea.addEventListener('mouseup', end);
            dragarea.addEventListener('mouseout', end);
        }
        onMove(position, dragarea, type) {
            const [x, y] = this.getPos(position.x, position.y, dragarea.offsetWidth, dragarea.offsetHeight);
            const fixAspect = 0 < this.width && 0 < this.height;
            switch (type) {
                case 0:
                    {
                        const sx = this.params.sx - x;
                        const sy = this.params.sy - y;
                        this.params.x -= sx;
                        this.params.X -= sx;
                        this.params.y -= sy;
                        this.params.Y -= sy;
                        this.params.sx = x;
                        this.params.sy = y;
                        break;
                    }
                case 1:
                    {
                        if (fixAspect) {
                            if (x + this.distance < this.params.X) {
                                this.params.x = x;
                            }
                            if (y + this.distance < this.params.Y) {
                                this.params.y = y;
                            }
                            const w = this.params.X - this.params.x;
                            const h = this.params.Y - this.params.y;
                            if (this.width / this.height < w / h) {
                                this.params.x = Math.floor(this.params.X - this.width * h / this.height);
                            }
                            else {
                                this.params.y = Math.floor(this.params.Y - this.height * w / this.width);
                            }
                        }
                        else {
                            if (x + this.distance < this.params.X) {
                                this.params.x = x;
                            }
                            if (y + this.distance < this.params.Y) {
                                this.params.y = y;
                            }
                        }
                        break;
                    }
                case 2:
                    {
                        if (fixAspect) {
                            if (this.params.x + this.distance < x) {
                                this.params.X = x;
                            }
                            if (y + this.distance < this.params.Y) {
                                this.params.y = y;
                            }
                            const w = this.params.X - this.params.x;
                            const h = this.params.Y - this.params.y;
                            if (this.width / this.height < w / h) {
                                this.params.X = Math.floor(this.params.x + this.width * h / this.height);
                            }
                            else {
                                this.params.y = Math.floor(this.params.Y - this.height * w / this.width);
                            }
                        }
                        else {
                            if (this.params.x + this.distance < x) {
                                this.params.X = x;
                            }
                            if (y + this.distance < this.params.Y) {
                                this.params.y = y;
                            }
                        }
                        break;
                    }
                case 3:
                    {
                        if (fixAspect) {
                            if (x + this.distance < this.params.X) {
                                this.params.x = x;
                            }
                            if (this.params.y + this.distance < y) {
                                this.params.Y = y;
                            }
                            const w = this.params.X - this.params.x;
                            const h = this.params.Y - this.params.y;
                            if (this.width / this.height < w / h) {
                                this.params.x = Math.floor(this.params.X - this.width * h / this.height);
                            }
                            else {
                                this.params.Y = Math.floor(this.params.y + this.height * w / this.width);
                            }
                        }
                        else {
                            if (x + this.distance < this.params.X) {
                                this.params.x = x;
                            }
                            if (this.params.y + this.distance < y) {
                                this.params.Y = y;
                            }
                        }
                        break;
                    }
                case 4:
                    {
                        if (fixAspect) {
                            if (this.params.x + this.distance < x) {
                                this.params.X = x;
                            }
                            if (this.params.y + this.distance < y) {
                                this.params.Y = y;
                            }
                            const w = this.params.X - this.params.x;
                            const h = this.params.Y - this.params.y;
                            if (this.width / this.height < w / h) {
                                this.params.X = Math.floor(this.params.x + this.width * h / this.height);
                            }
                            else {
                                this.params.Y = Math.floor(this.params.y + this.height * w / this.width);
                            }
                        }
                        else {
                            if (this.params.x + this.distance < x) {
                                this.params.X = x;
                            }
                            if (this.params.y + this.distance < y) {
                                this.params.Y = y;
                            }
                        }
                        break;
                    }
            }
            this.onUpdate();
        }
        setImage(img) {
            this.canvas.width = img.naturalWidth;
            this.canvas.height = img.naturalHeight;
            if (this.w <= 0) {
                this.w = this.width;
            }
            if (this.h <= 0) {
                this.h = this.height;
            }
            this.img = img;
            this.params.x = this.x;
            this.params.y = this.y;
            this.params.X = this.x + Math.max(this.w, this.distance * 2);
            this.params.Y = this.y + Math.max(this.h, this.distance * 2);
            this.onUpdate();
        }
        onUpdate() {
            const context = this.canvas.getContext('2d');
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            context.drawImage(this.img, 0, 0);
            context.fillStyle = 'rgba( 0, 0, 0, 0.5 )';
            const width = this.canvas.width;
            const height = this.canvas.height;
            const dx = this.params.x;
            const dy = this.params.y;
            const dw = this.params.X - this.params.x;
            const dh = this.params.Y - this.params.y;
            context.fillRect(0, 0, width, dy);
            context.fillRect(0, dy, dx, dh);
            context.fillRect(dx + dw, dy, width - dx - dw, dh);
            context.fillRect(0, dy + dh, width, height - dy - dh);
            context.strokeStyle = 'white';
            context.lineWidth = 4;
            context.beginPath();
            context.moveTo(dx, dy);
            context.arc(dx, dy, this.distance, 0.5 * Math.PI, 0);
            context.closePath();
            context.stroke();
            context.beginPath();
            context.moveTo(this.params.X, dy);
            context.arc(this.params.X, dy, this.distance, Math.PI, 2.5 * Math.PI);
            context.closePath();
            context.stroke();
            context.beginPath();
            context.moveTo(dx, this.params.Y);
            context.arc(dx, this.params.Y, this.distance, 0, 1.5 * Math.PI);
            context.closePath();
            context.stroke();
            context.beginPath();
            context.moveTo(this.params.X, this.params.Y);
            context.arc(this.params.X, this.params.Y, this.distance, -0.5 * Math.PI, Math.PI);
            context.closePath();
            context.stroke();
        }
        get distance() { return Math.max(parseInt(this.getAttribute('distance') || '') || 0, DEFALUT_DISTANCE); }
        set distance(value) { this.setAttribute('distance', value + ''); }
        get x() { return parseInt(this.getAttribute('x') || '') || 0; }
        set x(value) { this.setAttribute('x', value + ''); }
        get y() { return parseInt(this.getAttribute('y') || '') || 0; }
        set y(value) { this.setAttribute('y', value + ''); }
        get w() { return parseInt(this.getAttribute('w') || '') || 0; }
        set w(value) { this.setAttribute('w', value + ''); }
        get h() { return parseInt(this.getAttribute('h') || '') || 0; }
        set h(value) { this.setAttribute('h', value + ''); }
        get width() { return parseInt(this.getAttribute('width') || '') || 0; }
        set width(value) { this.setAttribute('width', value + ''); }
        get height() { return parseInt(this.getAttribute('height') || '') || 0; }
        set height(value) { this.setAttribute('height', value + ''); }
        get show() { return this.hasAttribute('show'); }
        set show(value) { if (!value) {
            this.removeAttribute('show');
        }
        else {
            this.setAttribute('show', '');
        } }
    }, script.dataset.tagname);
});
Promise.all([
    customElements.whenDefined('triming-area'),
    customElements.whenDefined('profile-area'),
]).then(() => {
    const profile = document.getElementById('profileimg');
    const edit = document.getElementById('editimg');
    let triming;
    profile.addEventListener('edit', (event) => {
        triming = event.detail.triming;
        edit.x = triming.sx;
        edit.y = triming.sy;
        edit.w = triming.sw;
        edit.h = triming.sh;
        edit.width = event.detail.triming.dw;
        edit.height = event.detail.triming.dh;
        setTimeout(() => {
            edit.setImage(event.detail.image);
            edit.show = true;
        });
    });
    edit.addEventListener('change', () => {
        triming.sx = edit.x;
        triming.sy = edit.y;
        triming.sw = edit.w;
        triming.sh = edit.h;
        profile.updateImage();
        edit.show = false;
    });
    document.querySelectorAll('header button').forEach((button) => {
        const target = button.id.replace('go_', '');
        button.addEventListener('click', () => {
            document.body.dataset.page = target;
        });
    });
});
