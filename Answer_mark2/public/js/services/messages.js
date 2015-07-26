angular.module('messageService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Messages', function($http) {
		return {
			get : function() {
				return $http.get('/api/messages');
			},
			create : function(messageData) {
				return $http.post('/api/messages', messageData);
			},
			delete : function(id) {
				return $http.delete('/api/messages/' + id);
			}//,
			//getLast : function(){
			//	  return $http.get(/api/messages/last');
			//}
			//,
			//exists : function(created_on){
			//	  return $http.get(/api/messages/created_on');
			//}
			,
			getUpdatedMessages : function(){
				  return $http.get('/api/messages/updated');
			}
		}
	});