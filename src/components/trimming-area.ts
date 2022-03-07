interface TrimmingAreaElement extends HTMLElement
{
	setImage( img: HTMLImageElement ): void;
	distance: number;
	x: number;
	y: number;
	w: number;
	h: number;
	width: number;
	height: number;
	show: boolean;
}

( ( script, init ) =>
{
	if ( document.readyState !== 'loading' ) { return init( script ); }
	document.addEventListener( 'DOMContentLoaded', () => { init( script ); } );
} )( <HTMLScriptElement>document.currentScript, ( script: HTMLScriptElement ) =>
{
	const DEFALUT_DISTANCE = 40;

	( ( component, tagname = 'trimming-area' ) =>
	{
		if ( customElements.get( tagname ) ) { return; }
		customElements.define( tagname, component );
	} )( class extends HTMLElement implements TrimmingAreaElement
	{
		private canvas: HTMLCanvasElement;
		private img: HTMLImageElement;
		private params =
		{
			x: 0, y: 0, X: 0, Y: 0, sx: 0, sy: 0,
		};

		constructor()
		{
			super();

			const shadow = this.attachShadow( { mode: 'open' } );

			const style = document.createElement( 'style' );
			style.innerHTML =
			[
				':host { display: none; width: 100%; height: 100%; top: 0; left: 0; position: absolute; background: rgba( 0, 0, 0, 0.8 ); overflow: hidden; --button-text: "Complete"; --button-border: none; --button-size: 1rem; --button-back: lightgray; --button-radius: 0.2rem; }',
				':host( [show] ) { display: block; }',
				':host > div { display: block; width: 100%; height: 100%; box-sizing: border-box; padding: 1rem; }',
				':host > div > div { display: grid; grid-template-columns: 100%; grid-template-rows: calc(100% - 2rem) 2rem; width: 100%; height: 100%; }',
				'.main { position: relative; }',
				'.sub {display: grid; grid-template-columns: 1fr 20%; grid-template-areas: ". c"; }',
				'.sub button { grid-area: c; }',
				'.dragarea { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }',
				'canvas { object-fit: contain; width: 100%; height: 100%; /*pointer-events: none; user-select: none; user-drag: none;*/ }',
				'button { cursor: pointer; border: var( --button-border ); font-size: var( --button-size ); background: var( --button-back ); border-radius: var( --button-radius ); }',
				'button::before { content: var( --button-text ); }',
			].join( '' );

			this.canvas = document.createElement( 'canvas' );
			const dragarea = document.createElement( 'div' );
			dragarea.classList.add( 'dragarea' );
			this.initMove( dragarea );

			const main = document.createElement( 'div' );
			main.classList.add( 'main' );
			main.draggable = false;
			main.appendChild( this.canvas );
			main.appendChild( dragarea );

			const complete = document.createElement( 'button' );
			complete.addEventListener( 'click', () =>
			{
				this.x = this.params.x;
				this.y = this.params.y;
				this.w = this.params.X - this.params.x;
				this.h = this.params.Y - this.params.y;
				this.dispatchEvent( new CustomEvent( 'change' ) );
			} );

			const sub = document.createElement( 'div' );
			sub.classList.add( 'sub' );
			sub.appendChild( complete );

			const area = document.createElement( 'div' );
			area.appendChild( main );
			area.appendChild( sub );

			const components = document.createElement( 'div' );
			components.addEventListener( 'click', ( event ) =>
			{
				event.stopPropagation();
			} );
			components.appendChild( area );

			shadow.appendChild( style );
			shadow.appendChild( components );
		}

		private getPos( clickX: number, clickY: number, parentWidth: number, parentHeight: number )
		{
			const diff = ( this.canvas.width / this.canvas.height < parentWidth / parentHeight ) ?
			{
				// portrait
				w: parentWidth - this.canvas.width * parentHeight / this.canvas.height,
				h: 0,
			}:
			{
				// landscape
				w: 0,
				h: parentHeight - this.canvas.height * parentWidth / this.canvas.width,
			}

			const w = this.canvas.width / ( parentWidth - diff.w );
			const h = this.canvas.height / ( parentHeight - diff.h );
			const x = Math.floor( ( clickX - diff.w / 2 ) * w );
			const y = Math.floor( ( clickY - diff.h / 2 ) * h );

			return [ x, y ];
		}

		private initMove( dragarea: HTMLElement )
		{
			let onmove: (null | (( event: MouseEvent | TouchEvent ) => void) ) = null;

			let touchMode = false;

			const getSelectPosition = ( event: MouseEvent | TouchEvent ) =>
			{
				if ( (<MouseEvent>event).offsetX !== undefined )
				{
					return {
						x: (<MouseEvent>event).offsetX,
						y: (<MouseEvent>event).offsetY,
					};
				}
				const touch = (<TouchEvent>event).changedTouches[ 0 ];
				const bounds = dragarea.getBoundingClientRect();
				return {
					x: touch.clientX - bounds.left,
					y: touch.clientY - bounds.top,
				};
			};

			const begin = ( position: { x: number, y: number } ) =>
			{
				if ( onmove )
				{
					dragarea.removeEventListener( 'mousemove', onmove );
					onmove = null;
				}

				const [ x, y ] = this.getPos( position.x, position.y, dragarea.offsetWidth, dragarea.offsetHeight );

				const pos = [
					{ type: 1, length: 0, x: this.params.x, y: this.params.y },
					{ type: 2, length: 0, x: this.params.X, y: this.params.y },
					{ type: 3, length: 0, x: this.params.x, y: this.params.Y },
					{ type: 4, length: 0, x: this.params.X, y: this.params.Y },
				].map( ( data ) =>
				{
					const a = data.x - x;
					const b = data.y - y;
					data.length = a * a + b * b;

					return data;
				} ).sort( ( a, b ) =>
				{
					return a.length - b.length;
				})[ 0 ];

				const dis = this.distance;
				const outPoint = dis * dis + dis * dis < pos.length;
				const outBox = x < this.params.x || this.params.X < x || y < this.params.y || this.params.Y < y;

				if ( outPoint && outBox ) { return -1; }
				if ( outPoint && !outBox ) { pos.type = 0; }
				this.params.sx = x;
				this.params.sy = y;

				return pos.type;
			};

			const end = () =>
			{
				touchMode = false;
				if ( onmove )
				{
					dragarea.removeEventListener( 'mousemove', onmove );
					dragarea.removeEventListener( 'touchmove', onmove );
					onmove = null;
				}
			};

			dragarea.addEventListener( 'touchstart', ( event ) =>
			{
				touchMode = true;

				const position = getSelectPosition( event );
				const type = begin( position );
				if ( type < 0 ) { return; }

				onmove = ( event ) =>
				{
					const position = getSelectPosition( event );
					this.onMove( position, dragarea, type );
				};
				dragarea.addEventListener( 'touchmove', onmove );
				this.onMove( position, dragarea, type );
			} );

			dragarea.addEventListener( 'touchend', end );

			dragarea.addEventListener( 'mousedown', ( event ) =>
			{
				if ( touchMode )
				{
					event.stopPropagation();
					event.preventDefault();
					return;
				}

				const position = getSelectPosition( event );
				const type = begin( position );
				if ( type < 0 ) { return; }

				onmove = ( event ) =>
				{
					const position = getSelectPosition( event );
					this.onMove( position, dragarea, type );
				};
				dragarea.addEventListener( 'mousemove', onmove );
				this.onMove( position, dragarea, type );
			} );

			dragarea.addEventListener( 'mouseup', end );

			dragarea.addEventListener( 'mouseout', end );
		}

		private onMove( position: { x: number, y: number }, dragarea: HTMLElement, type: number )
		{
			const [ x, y ] = this.getPos( position.x, position.y, dragarea.offsetWidth, dragarea.offsetHeight );

			const fixAspect = 0 < this.width && 0 < this.height;
			switch ( type )
			{
				case 0:
				{
					const move =
					{
						x: x - this.params.sx,
						y: y - this.params.sy,
					};
					if ( this.params.x + move.x < 0 ) { move.x = - this.params.x; }
					if ( this.canvas.width < this.params.X + move.x ) { move.x = this.canvas.width - this.params.X; }
					if ( this.params.y + move.y < 0 ) { move.y = - this.params.y; }
					if ( this.canvas.height < this.params.Y + move.y ) { move.y = this.canvas.height - this.params.Y; }
					this.params.x += move.x;
					this.params.X += move.x;
					this.params.y += move.y;
					this.params.Y += move.y;
					this.params.sx = x;
					this.params.sy = y;
					break;
				}
				case 1:
				{
					if ( fixAspect )
					{
						if ( x + this.distance < this.params.X )
						{
							this.params.x = x;
						}
						if ( y + this.distance < this.params.Y )
						{
							this.params.y = y;
						}
						const w = this.params.X - this.params.x;
						const h = this.params.Y - this.params.y;
						if ( this.width / this.height < w / h )
						{
							// portrait
							this.params.x = Math.floor( this.params.X - this.width * h / this.height );
						} else
						{
							// landscape
							this.params.y = Math.floor( this.params.Y - this.height * w / this.width );
						}
					} else
					{
						if ( x + this.distance < this.params.X )
						{
							this.params.x = x;
						}
						if ( y + this.distance < this.params.Y )
						{
							this.params.y = y;
						}
					}
					break;
				}
				case 2:
				{
					if ( fixAspect )
					{
						if ( this.params.x + this.distance < x )
						{
							this.params.X = x;
						}
						if ( y + this.distance < this.params.Y )
						{
							this.params.y = y;
						}
						const w = this.params.X - this.params.x;
						const h = this.params.Y - this.params.y;
						if ( this.width / this.height < w / h )
						{
							// portrait
							this.params.X = Math.floor( this.params.x + this.width * h / this.height );
						} else
						{
							// landscape
							this.params.y = Math.floor( this.params.Y - this.height * w / this.width );
						}

					} else
					{
						if ( this.params.x + this.distance < x )
						{
							this.params.X = x;
						}
						if ( y + this.distance < this.params.Y )
						{
							this.params.y = y;
						}
					}
					break;
				}
				case 3:
				{
					if ( fixAspect )
					{
						if ( x + this.distance < this.params.X )
						{
							this.params.x = x;
						}
						if ( this.params.y + this.distance < y )
						{
							this.params.Y = y;
						}
						const w = this.params.X - this.params.x;
						const h = this.params.Y - this.params.y;
						if ( this.width / this.height < w / h )
						{
							// portrait
							this.params.x = Math.floor( this.params.X - this.width * h / this.height );
						} else
						{
							// landscape
							this.params.Y = Math.floor( this.params.y + this.height * w / this.width );
						}

					} else
					{
						if ( x + this.distance < this.params.X )
						{
							this.params.x = x;
						}
						if ( this.params.y + this.distance < y )
						{
							this.params.Y = y;
						}
					}
					break;
				}
				case 4:
				{
					if ( fixAspect )
					{
						if ( this.params.x + this.distance < x )
						{
							this.params.X = x;
						}
						if ( this.params.y + this.distance < y )
						{
							this.params.Y = y;
						}
						const w = this.params.X - this.params.x;
						const h = this.params.Y - this.params.y;
						if ( this.width / this.height < w / h )
						{
							// portrait
							this.params.X = Math.floor( this.params.x + this.width * h / this.height );
						} else
						{
							// landscape
							this.params.Y = Math.floor( this.params.y + this.height * w / this.width );
						}
					} else
					{
						if ( this.params.x + this.distance < x )
						{
							this.params.X = x;
						}
						if ( this.params.y + this.distance < y )
						{
							this.params.Y = y;
						}
					}
					break;
				}
			}
			this.onUpdate();
		}

		public setImage( img: HTMLImageElement )
		{
			this.canvas.width = img.naturalWidth;
			this.canvas.height = img.naturalHeight;
			if ( this.w <= 0 ) { this.w = this.width; }
			if ( this.h <= 0 ) { this.h = this.height; }
			this.img = img;
			this.params.x = this.x;
			this.params.y = this.y;
			this.params.X = this.x + Math.max( this.w, this.distance * 2 );
			this.params.Y = this.y + Math.max( this.h, this.distance * 2 );

			this.onUpdate();
		}

		private onUpdate()
		{
			const context = <CanvasRenderingContext2D>this.canvas.getContext( '2d' );
			context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
			context.drawImage( this.img, 0, 0 );
			context.fillStyle = 'rgba( 0, 0, 0, 0.5 )';
			const width = this.canvas.width;
			const height = this.canvas.height;
			const dx = this.params.x;
			const dy = this.params.y;
			const dw = this.params.X - this.params.x;
			const dh = this.params.Y - this.params.y;
			context.fillRect( 0, 0, width, dy );
			context.fillRect( 0, dy, dx, dh );
			context.fillRect( dx + dw, dy, width - dx - dw, dh );
			context.fillRect( 0, dy + dh, width, height - dy - dh );
			context.strokeStyle = 'white';
			context.lineWidth = 4;
			context.beginPath();
			context.moveTo( dx, dy );
			context.arc( dx, dy, this.distance, 0.5 * Math.PI, 0 );
			context.closePath();
			context.stroke();

			context.beginPath();
			context.moveTo( this.params.X, dy );
			context.arc( this.params.X, dy, this.distance, Math.PI, 2.5 * Math.PI );
			context.closePath();
			context.stroke();

			context.beginPath();
			context.moveTo( dx, this.params.Y );
			context.arc( dx, this.params.Y, this.distance, 0, 1.5 * Math.PI );
			context.closePath();
			context.stroke();

			context.beginPath();
			context.moveTo( this.params.X, this.params.Y );
			context.arc( this.params.X, this.params.Y, this.distance, -0.5 * Math.PI, Math.PI );
			context.closePath();
			context.stroke();
		}

		get distance() { return Math.max( parseInt( this.getAttribute( 'distance' ) || '' ) || 0, DEFALUT_DISTANCE ); }
		set distance( value ) { this.setAttribute( 'distance', value + '' ); }

		get x() { return parseInt( this.getAttribute( 'x' ) || '' ) || 0; }
		set x( value ) { this.setAttribute( 'x', value + '' ); }

		get y() { return parseInt( this.getAttribute( 'y' ) || '' ) || 0; }
		set y( value ) { this.setAttribute( 'y', value + '' ); }

		get w() { return parseInt( this.getAttribute( 'w' ) || '' ) || 0; }
		set w( value ) { this.setAttribute( 'w', value + '' ); }

		get h() { return parseInt( this.getAttribute( 'h' ) || '' ) || 0; }
		set h( value ) { this.setAttribute( 'h', value + '' ); }

		get width() { return parseInt( this.getAttribute( 'width' ) || '' ) || 0; }
		set width( value ) { this.setAttribute( 'width', value + '' ); }

		get height() { return parseInt( this.getAttribute( 'height' ) || '' ) || 0; }
		set height( value ) { this.setAttribute( 'height', value + '' ); }

		get show() { return this.hasAttribute( 'show' ); }
		set show( value ) { if ( !value ) { this.removeAttribute( 'show' ) } else { this.setAttribute( 'show', '' ); } }
	}, script.dataset.tagname );
} );
