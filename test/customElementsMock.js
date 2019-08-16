export default class CustomElementsMock{} //dummy export

//following command mocks the customElements feature to be able
//to import custom elements in jest tests
window.customElements = {
    define: (elementName, elementClass)=>{
        console.log('Mocked customElements.define(..) for custom element "' + elementName + '"');
    }
};