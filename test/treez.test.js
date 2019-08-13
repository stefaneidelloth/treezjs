import DTreez from '../src/core/dtreez/dTreez.js'; 

import TreeView from '../src/views/treeView.js';
import EditorView from '../src/views/editorView.js';
import MonitorView from '../src/views/monitorView.js';
import GraphicsView from '../src/views/graphicsView.js';

import Treez from '../src/treez.js';

jest.mock('../src/core/dtreez/dTreez.js',() => {return jest.fn().mockImplementation(
	function(d3){	
		return this;
});});

jest.mock('../src/views/treeView.js', ()=> {return jest.fn().mockImplementation(
	function (treez){
		this.id = 'treeViewMock';
		this.buildView = jest.fn();
		return this;
});});

jest.mock('../src/views/editorView.js',() => {return jest.fn().mockImplementation(
	function(treez){
		this.id = 'editorViewMock';
		this.buildView = jest.fn();
		return this;
});});

jest.mock('../src/views/monitorView.js',() => {return jest.fn().mockImplementation(
	function(treez){
		this.id = 'monitorViewMock';
		this.buildView = jest.fn();
		return this;
});});

jest.mock('../src/views/graphicsView.js',() => {return jest.fn().mockImplementation(
	function(treez){
		this.id = 'graphicsViewMock';
		this.buildView = jest.fn();
		return this;
});});





describe('Construction', ()=>{
	var d3Mock = {};
	var editorFactoryMock = {};
	var focusManagerMock = {};
	
	it('construction', ()=>{		
		
		new Treez(d3Mock, editorFactoryMock, focusManagerMock);

		expect(DTreez).toHaveBeenCalledTimes(1);

		expect(TreeView).toHaveBeenCalledTimes(1);
		expect(EditorView).toHaveBeenCalledTimes(1);
		expect(MonitorView).toHaveBeenCalledTimes(1);		
		expect(GraphicsView).toHaveBeenCalledTimes(1);
	});
});

describe('Public API', ()=>{ 
	
	var d3Mock = {};
	var editorFactoryMock = {};
	var focusManagerMock = { focusGraphicsView: jest.fn() };

	it('config', ()=>{
		var configMock = {
			home: '.',
			isSupportingPython: false
		};
		Treez.config(configMock);
		expect(window.treezConfig).toBe(configMock);
	});

	it('initialize', ()=>{	
		var terminalMock = 'terminalMock';
		var terminalFactoryMock = (thenDelegate)=>{
			thenDelegate(terminalMock);
		};

		var importCssSpy = jest.spyOn(Treez,'__importCssStyleSheetsForViews');
		var buildViewsSpy = jest.spyOn(Treez,'__buildViews');

		Treez.initialize(d3Mock, focusManagerMock, editorFactoryMock, terminalFactoryMock);

		expect(importCssSpy).toHaveBeenCalledTimes(1);
		expect(buildViewsSpy).toHaveBeenCalledTimes(1);

		expect(window.treezTerminal).toBe(terminalMock);
	});

	describe('Import utils', ()=>{

		var homeMock = 'homeMock';		

		var styleSheetUrlMock = '/src/views/mock.css';
		var scriptUrlMock = '/src/mock.js';

		beforeEach(()=>{
			window.treezConfig = {home: homeMock};

			while(document.head.firstChild){
				document.head.firstChild.remove();
			}	
		});

		it('importCssStyleSheet', ()=>{				
			Treez.importCssStyleSheet(styleSheetUrlMock);
	
			var linkElement = document.head.firstChild;
			expect(linkElement.href).toBe('http://localhost/' + homeMock + styleSheetUrlMock);
		});	

		it('importStaticCssStyleSheet', ()=>{				
			Treez.importStaticCssStyleSheet(styleSheetUrlMock);
	
			var linkElement = document.head.firstChild;
			expect(linkElement.href).toBe('http://localhost' + styleSheetUrlMock);
		});	

		it('importScript', ()=>{
			Treez.importScript(scriptUrlMock);
			var scriptElement = document.head.firstChild;
			expect(scriptElement.src).toBe('http://localhost/' + homeMock + scriptUrlMock);
		});	
	
		it('importStaticScript', ()=>{
			Treez.importStaticScript(scriptUrlMock);
			var scriptElement = document.head.firstChild;
			expect(scriptElement.src).toBe('http://localhost' + scriptUrlMock);
		});	

		it('imagePath', ()=>{
			var imageName = 'mock.png';
			expect(Treez.imagePath(imageName)).toBe(homeMock + '/icons/' + imageName);
		});	

	});
	
	describe('Instance methods', function(){

		var terminalFactoryMock = ()=>{};
		var treez;

		beforeEach(()=>{				
			treez = Treez.initialize(d3Mock, focusManagerMock, editorFactoryMock, terminalFactoryMock);
		});

		it('focusGraphicsView', ()=>{	
			treez.focusGraphicsView();
			expect(focusManagerMock.focusGraphicsView.mock.calls.length).toBe(1);
		});	
	
		it('get treeView', ()=>{
			expect(treez.treeView.id).toBe('treeViewMock');
		});	
	
		it('get editorView', ()=>{
			var editorMock = {}
			treez.editor = editorMock;			
		});			
	
		it('get monitorView', ()=>{
			expect(treez.monitorView.id).toBe('monitorViewMock');
		});	
	
		it('get graphicsView', ()=>{
			expect(treez.graphicsView.id).toBe('graphicsViewMock');
		});	

		it('editor', ()=>{

			var editorMock = {
				setText: function(code, finishedHandler){},
				processText: function(textHandler){}
			}

			treez.editor = editorMock;

			expect(treez.editor).toBe(editorMock);
		});

	});

	

});

describe('Private API', ()=>{ 

	var treezMock = {
		__treeView: {buildView: jest.fn()},
		__editorView: {buildView: jest.fn()},
		__monitorView: {buildView: jest.fn()},
		__graphicsView: {buildView: jest.fn()}
	};

	var editorFactoryMock = {};

	it('__buildViews',()=>{

		Treez.__buildViews(treezMock, editorFactoryMock);

		expect(treezMock.__treeView.buildView.mock.calls.length).toBe(1);
		expect(treezMock.__editorView.buildView.mock.calls.length).toBe(1);
		expect(treezMock.__monitorView.buildView.mock.calls.length).toBe(1);
		expect(treezMock.__graphicsView.buildView.mock.calls.length).toBe(1);
	});

	it('__importCssStyleSheetsForViews',()=>{
		var spy = spyOn(Treez,'importCssStyleSheet');
		Treez.__importCssStyleSheetsForViews();
		expect(spy).toHaveBeenCalledTimes(5);
	});


});

