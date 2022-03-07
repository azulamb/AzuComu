interface TrimmingButtonElement extends HTMLElement
{
	addEventListener( type: 'close', listener: ( event: CustomEvent ) => any ): void;
	addEventListener( type: 'main', listener: ( event: CustomEvent ) => any ): void;

	sw: number;
	sh: number;
	sx: number;
	sy: number;
	dw: number;
	dh: number;
	dx: number;
	dy: number;
}

( ( script, init ) =>
{
	if ( document.readyState !== 'loading' ) { return init( script ); }
	document.addEventListener( 'DOMContentLoaded', () => { init( script ); } );
} )( <HTMLScriptElement>document.currentScript, ( script: HTMLScriptElement ) =>
{
	( ( component, tagname = 'trimming-button' ) =>
	{
		if ( customElements.get( tagname ) ) { return; }
		customElements.define( tagname, component );
	} )( class extends HTMLElement implements TrimmingButtonElement
	{
		constructor()
		{
			super();

			const shadow = this.attachShadow( { mode: 'open' } );

			const style = document.createElement( 'style' );
			style.innerHTML =
			[
				':host { display: block; width: 100%; height: 100%; }',
				':host > div { display: block; width: 100%; height: 100%; position: relative; }',
				'button { display: block; cursor: pointer; border: none; background: none; position: absolute; box-sizing: border: none; padding: 0; }',
				'#main { width: 100%; height: 100%; top: 0; left: 0; }',
				'#close { width: 2rem; height: 2rem; top: 0.5rem; right: 0.5rem; }',
				'#close::before { display: inline; content: "×"; line-height: 2rem; font-size: 2rem; }',
			].join( '' );

			const main = document.createElement( 'button' );
			main.id = 'main';
			main.addEventListener( 'click', ( event ) =>
			{
				event.stopPropagation();
				this.dispatchEvent( new CustomEvent( 'main' ) );
			} );

			const close = document.createElement( 'button' );
			close.id = 'close';
			close.addEventListener( 'click', ( event ) =>
			{
				event.stopPropagation();
				this.dispatchEvent( new CustomEvent( 'close' ) );
			} );

			const components = document.createElement( 'div' );
			components.appendChild( main );
			components.appendChild( close );

			shadow.appendChild( style );
			shadow.appendChild( components );
		}

		get sw() { return parseInt( this.getAttribute( 'sw' ) || '' ) || 0; }
		set sw( value ) { this.setAttribute( 'sw', value + '' ); }

		get sh() { return parseInt( this.getAttribute( 'sh' ) || '' ) || 0; }
		set sh( value ) { this.setAttribute( 'sh', value + '' ); }

		get sx() { return parseInt( this.getAttribute( 'sx' ) || '' ) || 0; }
		set sx( value ) { this.setAttribute( 'sx', value + '' ); }

		get sy() { return parseInt( this.getAttribute( 'sy' ) || '' ) || 0; }
		set sy( value ) { this.setAttribute( 'sy', value + '' ); }

		get dw() { return parseInt( this.getAttribute( 'dw' ) || '' ) || 0; }
		set dw( value ) { this.setAttribute( 'dw', value + '' ); }

		get dh() { return parseInt( this.getAttribute( 'dh' ) || '' ) || 0; }
		set dh( value ) { this.setAttribute( 'dh', value + '' ); }

		get dx() { return parseInt( this.getAttribute( 'dx' ) || '' ) || 0; }
		set dx( value ) { this.setAttribute( 'dx', value + '' ); }

		get dy() { return parseInt( this.getAttribute( 'dy' ) || '' ) || 0; }
		set dy( value ) { this.setAttribute( 'dy', value + '' ); }
	}, script.dataset.tagname );
} );
