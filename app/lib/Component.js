// @flow
'use strict'

class WebComponent extends HTMLElement {

	_template : HTMLTemplateElement
	shadow : ShadowRoot

	constructor() {
		super()
		this._attachShadow()
		this._domDataBind()
	}

	_domDataBind() {
		const nodes : any = this.shadow.children
		const regexp : RegExp = /\[\[\s*([^\W+\d+\W+]\w+)\s*]]/gim

		for(let node of nodes) {
			const nodeText : string = node.innerText
			const nodeData : Array<[]> = []

			let binding : Array<mixed>

			while ((binding = regexp.exec(nodeText))) {
				nodeData.push(binding)
			}

			if(!nodeData.length) continue

			for(let _bind of nodeData) {
				const name : string = _bind[1]

				Object.defineProperty(this, `_${name}`, {
					enumerable: false,
					writable: true
				})

				Object.defineProperty(this, name, {
					set: function (value : string = '') {
						if(this[`_${name}`] === value) return
						this[`_${name}`] = value
						node.innerText = nodeText.replace(_bind[0], value)
					},
					get: function () : string {
						return this[`_${name}`]
					}
				})
			}
		}
	}

	get template () : HTMLTemplateElement {
		if(!this._template) this.template = void 0
		return this._template
	}

	set template (selector : string = 'template') {
		this._template = this._document().querySelector(selector).content.cloneNode(true)
	}

	_attachShadow() {
		if(!this.shadow) {
			this.shadow = this.attachShadow({mode: 'open'})
		}
		this.shadow.appendChild(this.template)
	}

	_document() : HTMLDocument {
		return document.currentScript
			? document.currentScript.ownerDocument
			: document._currentScript.ownerDocument
	}

}

//temporary solution
window.WebComponent = WebComponent
