interface FileAreaElement extends HTMLElement
{
	addEventListener( type: 'dropfile', listener: ( event: DropFileEvent ) => any, options?: boolean | AddEventListenerOptions ): void;
	loading: boolean;
	loaded: boolean;
	accept: string;
	reset(): void;
}

interface DropFileEvent extends CustomEvent
{
	detail: { file: File; };
}

( ( script, init ) =>
{
	if ( document.readyState !== 'loading' ) { return init( script ); }
	document.addEventListener( 'DOMContentLoaded', () => { init( script ); } );
} )( <HTMLScriptElement>document.currentScript, ( script: HTMLScriptElement ) =>
{
	( ( component, tagname = 'file-area' ) =>
	{
		if ( customElements.get( tagname ) ) { return; }
		customElements.define( tagname, component );
	} )( class extends HTMLElement implements FileAreaElement
	{
		private file: HTMLInputElement;

		constructor()
		{
			super();

			const shadow = this.attachShadow( { mode: 'open' } );

			const style = document.createElement( 'style' );
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
				'label .label::before { content: "ファイル選択"; }',
				':host( [loading] ) > div .hover::before { content: "読込中"; }',
				':host( [loaded] ) > div .hover::before { content: "編集"; }',
			].join( '' );

			this.file = document.createElement( 'input' );
			this.file.type = 'file';
			this.file.id = 'file';
			this.file.addEventListener( 'change', ( event ) =>
			{
				if ( !this.file.files ) {  return; }
				this.onDrop( this.file.files[ 0 ] );
			} );

			const labelFle = document.createElement( 'div' );
			labelFle.classList.add( 'label' );

			const label = <HTMLLabelElement>document.createElement( 'label' );
			label.setAttribute( 'for', 'file' );
			label.appendChild( this.file );
			label.appendChild( labelFle );

			label.addEventListener( 'dragover', ( event ) =>
			{
				event.stopPropagation();
				event.preventDefault();
				if ( event.dataTransfer ) { event.dataTransfer.dropEffect = 'copy'; }
			} );

			label.addEventListener( 'drop', ( event ) =>
			{
				event.stopPropagation();
				event.preventDefault();
				const dataTransfer = event.dataTransfer;
				if ( !dataTransfer ) { return; }
				const files = dataTransfer.files;
				if ( files.length < 1 ) { return; }
				const file = files[ 0 ];
				this.onDrop( file );
			} );

			const labelLoading = document.createElement( 'div' );
			labelLoading.classList.add( 'hover' );

			const components = document.createElement( 'div' );
			components.appendChild( document.createElement( 'slot' ) );
			components.appendChild( labelLoading );

			shadow.appendChild( style );
			shadow.appendChild( label );
			shadow.appendChild( components );
		}

		private onDrop( file: File )
		{
			this.dispatchEvent( new CustomEvent( 'dropfile', { detail: { file: file } } ) );
		}

		get accept() { return this.file.accept; }
		set accept( value ) { this.setAttribute( 'accept', value + '' ); }

		get loading() { return this.hasAttribute( 'loading' ); }
		set loading( value )
		{
			if ( !value )
			{
				this.removeAttribute( 'loading' );
			} else
			{
				this.setAttribute( 'loading', '' );
				this.loaded = false;
			}
		}

		get loaded() { return this.hasAttribute( 'loaded' ); }
		set loaded( value )
		{
			if ( !value )
			{
				this.removeAttribute( 'loaded' );
			} else
			{
				this.setAttribute( 'loaded', '' );
				this.loading = false;
			}
		}

		public reset(): void
		{
			this.file.value = '';
		}

		static get observedAttributes() { return [ 'accept' ]; }

		public attributeChangedCallback( attrName: string, oldVal: any , newVal: any )
		{
			if ( oldVal === newVal ) { return; }

			this.file.accept = newVal;
		}
	}, script.dataset.tagname );
} );
