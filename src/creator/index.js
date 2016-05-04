import * as React from 'react';

// function _newStepEventCallback(evt) {
	// 	steps.push({
	// 		url: '', // use this
	// 		type: evt.type,
	// 		target: evt.target
	// 	});
	// 	console.log(steps);
	// 	// clearing event, to run only once
	// 	document.removeEventListener(evt.type, _newStepEventCallback);
	// 	evt.preventDefault();
	// }


	// // Add new step listener
	// document.querySelector('.walkthrough-steps').addEventListener('submit', function(evt){
	// 	var event = stepEventSelected = document.forms['walkthrough-steps'].elements['event'].value;
	// 	console.log('Listening for: ', event);
	// 	document.addEventListener(event, _newStepEventCallback);
	// 	evt.preventDefault();
	// });


	// // Cancel new step listener
	// document.querySelector('[name=cancel-step]').addEventListener('click', function(evt){
	// 	document.removeEventListener(stepEventSelected, _newStepEventCallback);
	// 	console.log('Stop listening for: ', stepEventSelected);
	// 	stepEventSelected = null;	
	// 	evt.stopPropagation();
	// });
	
export default React.createClass({
	render: function(){
		return <h1>Oi mundo</h1>;
	}
});