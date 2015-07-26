angular.module('messageController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', function($scope, $http, Messages) {
		$scope.formData = {};

		// GET =====================================================================
		// when landing on the page, get all messages and show them
		// use the service to get all the messages
		Messages.get()
			.success(function(data) {
				$scope.messages = data;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createMessage = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.status != undefined
					&& $scope.formData.body != undefined
					&& $scope.formData.created_on != undefined) {

				// call the create function from our service (returns a promise object)
				Messages.create($scope.formData)

					// if successful creation, call our get function to get all the new messages
					.success(function(data) {
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.messages = data; // assign our new list of messages
					});
			}
		};

		// update!! ==================================================================
		$scope.getUpdated = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			//if ($scope.formData.status != undefined
			//	&& $scope.formData.body != undefined
			//	&& $scope.formData.created_on != undefined) {

				// call the create function from our service (returns a promise object)
		Messages.getUpdatedMessages()

			// if successful creation, call our get function to get all the new messages
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.messages = data; // assign our new list of messages
					});
			//}
		};


		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteMessage = function(id) {
			Messages.delete(id)
				// if successful creation, call our get function to get all the new messages
				.success(function(data) {
					$scope.messages = data; // assign our new list of messages
				});
		};
	});