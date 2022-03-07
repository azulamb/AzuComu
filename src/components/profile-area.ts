/// <reference path="./file-area.ts" />
/// <reference path="./triming-button.ts" />

interface ProfileAreaElement extends HTMLElement
{
	addEventListener( type: 'edit', listener: ( event: ProfileAreaEvent ) => any ): void;
	updateImage(): void;
	preview: boolean;
}

interface ProfileAreaEvent extends CustomEvent
{
	detail: ProfileAreaEventData;
}

interface ProfileAreaEventData
{
	triming: TrimingButtonElement;
	image: HTMLImageElement;
}

( ( script, init ) =>
{
	Promise.all(
	[
		customElements.whenDefined( 'file-area' ),
		customElements.whenDefined( 'triming-button' ),
	] ).then( () => { init( script ); } );
} )( <HTMLScriptElement>document.currentScript, ( script: HTMLScriptElement ) =>
{
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
	( ( component, tagname = 'profile-area' ) =>
	{
		if ( customElements.get( tagname ) ) { return; }
		customElements.define( tagname, component );
	} )( class extends HTMLElement implements ProfileAreaElement
	{
		private frame: HTMLImageElement;
		private canvas: HTMLCanvasElement;
		private imgs:
		{
			main?: HTMLImageElement,
			wife0?: HTMLImageElement,
			wife1?: HTMLImageElement,
			wife2?: HTMLImageElement,
		} = {};
		private triming:
		{
			main: TrimingButtonElement,
			wife0: TrimingButtonElement,
			wife1: TrimingButtonElement,
			wife2: TrimingButtonElement,
		} = <any>{};
		private commander = '';
		private server = '';
		private year = '';
		private month = '';
		private day = '';
		private comment = '';

		constructor()
		{
			super();

			const shadow = this.attachShadow( { mode: 'open' } );

			const style = document.createElement( 'style' );
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
			].join( '' );

			this.canvas = document.createElement( 'canvas' );

			this.frame = document.createElement( 'img' );
			this.frame.onload = () =>
			{
				this.canvas.width = this.frame.naturalWidth;
				this.canvas.height = this.frame.naturalHeight;
				this.updateImage();
			};
			this.frame.src = './frame.png';

			const contents = document.createElement( 'div' );
			contents.appendChild( this.createInput() );
			contents.appendChild( this.createFooter() );

			shadow.appendChild( style );
			shadow.appendChild( contents );
		}

		private createInput()
		{
			this.triming.main = new (<{ new(): TrimingButtonElement }>customElements.get( 'triming-button' ))();
			this.triming.main.sw = 562;
			this.triming.main.sh = 480;
			this.triming.main.dx = 13;
			this.triming.main.dy = 13;
			this.triming.main.dw = 562;
			this.triming.main.dh = 480;
			this.triming.main.addEventListener( 'close', () =>
			{
				main.loaded = false;
				delete this.imgs.main;
				this.updateImage();
				main.reset();
			} );
			this.triming.main.addEventListener( 'main', () =>
			{
				if ( !this.imgs.main ) { return; }
				this.onEdit( this.triming.main, this.imgs.main );
			} );

			const main = new (<{ new(): FileAreaElement }>customElements.get( 'file-area' ))();
			main.id = 'main';
			main.accept = 'image/*';
			main.appendChild( this.triming.main );
			main.addEventListener( 'dropfile', ( event ) =>
			{
				main.loading = true;
				this.loadImage( 'main', event.detail.file, main );
			} );

			const wifes: HTMLElement[] = [];
			for ( let i = 0 ; i < 3 ; ++i )
			{
				const key: 'main' = <any>`wife${ i }`;
				const triming = new (<{ new(): TrimingButtonElement }>customElements.get( 'triming-button' ))();
				this.triming[ key ] = triming;
				triming.dx = 581 + i * 101 + ( i === 1 ? 1 : 0 );//683,784
				triming.dy = 223;
				triming.dw = 97;
				triming.dh = 126;
				triming.sw = 97;
				triming.sh = 126;
				triming.addEventListener( 'close', () =>
				{
					wife.loaded = false;
					delete this.imgs[ key ];
					this.updateImage();
				} );
				triming.addEventListener( 'main', () =>
				{
					const img = this.imgs[ key ];
					if ( !img ) { return; }
					this.onEdit( triming, img );
				} );
	
				const wife = new (<{ new(): FileAreaElement }>customElements.get( 'file-area' ))();
				wife.accept = 'image/*';
				wife.appendChild( this.triming[ key ] );
				wife.addEventListener( 'dropfile', ( event ) =>
				{
					wife.loading = true;
					this.loadImage( `wife${ i }`, event.detail.file, wife );
				} );

				const block = document.createElement( 'div' );
				block.id = `wife${ i }`;
				block.classList.add( 'wife' );
				block.appendChild( wife );
				wifes.push( block );
			}

			const wrapper = document.createElement( 'div' );
			wrapper.appendChild( this.frame );
			wrapper.appendChild( this.canvas );
			wrapper.appendChild( main );
			for ( const wife of wifes )
			{
				wrapper.appendChild( wife );
			}
			wrapper.appendChild( this.createCommander() );
			wrapper.appendChild( this.createServer() );
			wrapper.appendChild( this.createBegin() );
			wrapper.appendChild( this.createComment() );

			return wrapper;
		}

		private createCommander()
		{
			const name = document.createElement( 'input' );
			name.addEventListener( 'blur', () =>
			{
				this.commander = name.value;
				this.updateImage();
			} );
			const commander = document.createElement( 'div' );
			commander.classList.add( 'input', 'commander' );
			commander.appendChild( name );

			return commander;
		}

		private createServer()
		{
			const select = document.createElement( 'select' );
			select.addEventListener( 'change', () =>
			{
				this.server = SERVERS[ select.selectedIndex ];
				this.updateImage();
			} );
			SERVERS.forEach( ( name ) =>
			{
				const option = document.createElement( 'option' );
				option.value = name;
				option.textContent = name;
				select.appendChild( option );
			} );
			const server = document.createElement( 'div' );
			server.classList.add( 'input', 'server' );
			server.appendChild( select );

			return server;
		}

		private createBegin()
		{
			const now = new Date();

			const year = document.createElement( 'select' );
			year.addEventListener( 'change', () =>
			{
				this.year = year.selectedOptions[ 0 ].value;
				this.updateImage();
			} );
			year.appendChild(  document.createElement( 'option' ) );
			for ( let y = 2017 ; y <= now.getFullYear() ; ++y )
			{
				const option = document.createElement( 'option' );
				option.value = y + '';
				option.textContent = option.value;
				year.appendChild( option );
			}

			const month = document.createElement( 'select' );
			month.addEventListener( 'change', () =>
			{
				this.month = month.selectedOptions[ 0 ].value;
				this.updateImage();
			} );
			month.appendChild(  document.createElement( 'option' ) );
			for ( let m = 1 ; m <= 12 ; ++m )
			{
				const option = document.createElement( 'option' );
				option.value = m + '';
				option.textContent = option.value;
				month.appendChild( option );
			}

			const day = document.createElement( 'select' );
			day.appendChild(  document.createElement( 'option' ) );
			day.addEventListener( 'change', () =>
			{
				this.day = day.selectedOptions[ 0 ].value;
				this.updateImage();
			} );
			for ( let d = 1 ; d <= 31 ; ++d )
			{
				const option = document.createElement( 'option' );
				option.value = d + '';
				option.textContent = option.value;
				day.appendChild( option );
			}

			const begin = document.createElement( 'div' );
			begin.classList.add( 'input', 'begin' );
			begin.appendChild( year );
			begin.appendChild( month );
			begin.appendChild( day );

			return begin;
		}

		private createComment()
		{
			const text = document.createElement( 'textarea' );
			text.addEventListener( 'blur', () =>
			{
				this.comment = text.value;
				this.updateImage();
			} );

			const comment = document.createElement( 'div' );
			comment.classList.add( 'input', 'comment' );
			comment.appendChild( text );

			return comment;
		}

		private createFooter()
		{
			const preview = document.createElement( 'button' );
			preview.classList.add( 'preview' );
			preview.addEventListener( 'click', ( event ) =>
			{
				event.stopPropagation();
				this.preview = !this.preview;
			} );
			const download = document.createElement( 'button' );
			download.classList.add( 'download' );
			download.addEventListener( 'click', ( event ) =>
			{
				event.stopPropagation();
				const link = document.createElement( 'a' );
				link.download = 'azucomm_profile.png';
				link.href = this.canvas.toDataURL();
				link.click();
			} );
			const footer = document.createElement( 'footer' );
			footer.appendChild( preview);
			footer.appendChild( download );

			return footer;
		}

		private drawText( context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, text: string )
		{
			context.textBaseline = 'middle';
			context.font = 'bold 26px i-rounded';
			context.fillStyle = 'white';
			context.strokeStyle = '#515151';
			context.lineWidth = 4;
			const texts = text.split( /\r\n|\n|\r/ );
			const w = texts.map( ( text ) =>
			{
				return context.measureText( text ).width + 4;
			} ).reduce( ( prev, now ) => { return prev < now ? now : prev; }, 0 );
			const h = texts.length * 40;
			//context.strokeRect(x,y,width,height);
			if ( width < w )
			{
				const canvas = document.createElement( 'canvas' );
				canvas.width = w;
				canvas.height = Math.max( h, height );
				const ctx = <CanvasRenderingContext2D>canvas.getContext( '2d' );
				ctx.textBaseline = 'middle';
				ctx.font = 'bold 26px i-rounded';
				ctx.fillStyle = 'white';
				ctx.strokeStyle = '#515151';
				ctx.lineWidth = 4;
				for ( let i = 0 ; i < texts.length ; ++i )
				{
					ctx.strokeText( texts[ i ], 2, 20 + i * 40 );
					ctx.fillText( texts[ i ], 2, 20 + i * 40 );
				}
				context.drawImage( canvas, x, y, width, height );
			} else
			{
				context.strokeText( text, x, y + 20 );
				context.fillText( text, x, y + 20 );	
			}
		}

		public updateImage()
		{
			const context = <CanvasRenderingContext2D>this.canvas.getContext( '2d' );
			context.clearRect( 0, 0, this.canvas.width, this.canvas.height );

			if ( this.imgs.main )
			{
				context.drawImage( this.imgs.main,
					this.triming.main.sx, this.triming.main.sy, this.triming.main.sw, this.triming.main.sh,
					this.triming.main.dx, this.triming.main.dy, this.triming.main.dw, this.triming.main.dh,
				);
			}
			if ( this.imgs.wife0 )
			{
				const wife = this.triming.wife0;
				context.drawImage( this.imgs.wife0,
					wife.sx, wife.sy, wife.sw, wife.sh,
					wife.dx, wife.dy, wife.dw, wife.dh,
				);
			}
			if ( this.imgs.wife1 )
			{
				const wife = this.triming.wife1;
				context.drawImage( this.imgs.wife1,
					wife.sx, wife.sy, wife.sw, wife.sh,
					wife.dx, wife.dy, wife.dw, wife.dh,
				);
			}
			if ( this.imgs.wife2 )
			{
				const wife = this.triming.wife2;
				context.drawImage( this.imgs.wife2,
					wife.sx, wife.sy, wife.sw, wife.sh,
					wife.dx, wife.dy, wife.dw, wife.dh,
				);
			}

			context.drawImage( this.frame, 0, 0 );

			this.drawText( context, 700, 20, 185, 40, this.commander );
			this.drawText( context, 700, 73, 185, 40, this.server );
			const date = [ this.year ];
			if ( this.month )
			{
				date.push( this.month );
				if ( this.day )
				{
					date.push( this.day );
				}
			}
			this.drawText( context, 700, 125, 185, 40, date.join( '/' ) );
			this.drawText( context, 577, 395, 308, 95, this.comment );
		}

		private loadImage( key: string, file: File, filearea: FileAreaElement )
		{
			delete this.imgs[ <'main'>key ];

			const reader = new FileReader();
			reader.addEventListener( 'load', () =>
			{
				const image = document.createElement( 'img' );
				image.onload = () =>
				{
					this.imgs[ <'main'>key ] = image;
					this.updateImage();
					filearea.loaded = true;
				};
				image.src = <string>reader.result;
			}, false );
			reader.readAsDataURL( file );
		}

		private onEdit( triming: TrimingButtonElement, image: HTMLImageElement )
		{
			const detail: ProfileAreaEventData =
			{
				triming: triming,
				image: image,
			};
			this.dispatchEvent( new CustomEvent( 'edit',
			{
				detail: detail,
			} ) );
		}

		get preview() { return this.hasAttribute( 'preview' ); }
		set preview( value ) { if ( !value ) { this.removeAttribute( 'preview' ) } else { this.setAttribute( 'preview', '' ); } }

	}, script.dataset.tagname );
} );
