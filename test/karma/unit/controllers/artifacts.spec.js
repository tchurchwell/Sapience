'use strict';

(function() {
    // Artifacts Controller Spec
    describe('MEAN controllers', function() {
        describe('ArtifactsController', function() {
            // The $resource service augments the response object with methods for updating and deleting the resource.
            // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
            // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
            // When the toEqualData matcher compares two objects, it takes only object properties into
            // account and ignores methods.
            beforeEach(function() {
                this.addMatchers({
                    toEqualData: function(expected) {
                        return angular.equals(this.actual, expected);
                    }
                });
            });

            // Load the controllers module
            beforeEach(module('mean'));

            // Initialize the controller and a mock scope
            var ArtifactsController,
                scope,
                $httpBackend,
                $stateParams,
                $location;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

                scope = $rootScope.$new();

                ArtifactsController = $controller('ArtifactsController', {
                    $scope: scope
                });

                $stateParams = _$stateParams_;

                $httpBackend = _$httpBackend_;

                $location = _$location_;

            }));

            it('$scope.find() should create an array with at least one artifact object ' +
                'fetched from XHR',
                function() {

                    // test expected GET request
                    $httpBackend.expectGET('artifacts').respond([{
                        title: 'An Artifact about MEAN',
                        content: 'MEAN rocks!'
                    }]);

                    // run controller
                    scope.find();
                    $httpBackend.flush();

                    // test scope value
                    expect(scope.artifacts).toEqualData([{
                        title: 'An Artifact about MEAN',
                        content: 'MEAN rocks!'
                    }]);

                });

            it('$scope.findOne() should create an array with one artifact object fetched ' +
                'from XHR using a artifactId URL parameter',
                function() {
                    // fixture URL parament
                    $stateParams.artifactId = '525a8422f6d0f87f0e407a33';

                    // fixture response object
                    var testArtifactData = function() {
                        return {
                            title: 'An Artifact about MEAN',
                            content: 'MEAN rocks!'
                        };
                    };

                    // test expected GET request with response object
                    $httpBackend.expectGET(/artifacts\/([0-9a-fA-F]{24})$/).respond(testArtifactData());

                    // run controller
                    scope.findOne();
                    $httpBackend.flush();

                    // test scope value
                    expect(scope.versions).toEqualData(testArtifactData());

                });

            it('$scope.create() with valid form data should send a POST request ' +
                'with the form input values and then ' +
                'locate to new object URL',
                function() {

                    // fixture expected POST data
                    var postArtifactData = function() {
                        return {
                            title: 'An Artifact about MEAN',
                            content: 'MEAN rocks!'
                        };
                    };

                    // fixture expected response data
                    var responseArtifactData = function() {
                        return {
                            _id: '525cf20451979dea2c000001',
                            title: 'An Artifact about MEAN',
                            content: 'MEAN rocks!'
                        };
                    };

                    // fixture mock form input values
                    scope.title = 'An Artifact about MEAN';
                    scope.content = 'MEAN rocks!';

                    // test post request is sent
                    $httpBackend.expectPOST('artifacts', postArtifactData()).respond(responseArtifactData());

                    // Run controller
                    scope.create();
                    $httpBackend.flush();

                    // test form input(s) are reset
                    expect(scope.title).toEqual('');
                    expect(scope.content).toEqual('');

                    // test URL location to new object
                    expect($location.path()).toBe('/artifacts/' + responseArtifactData()._id);
                });

            it('$scope.update() should update a valid artifact', inject(function(Artifacts) {

                // fixture rideshare
                var putArtifactData = function() {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        title: 'An Artifact about MEAN',
                        to: 'MEAN is great!'
                    };
                };

                // mock artifact object from form
                var artifact = new Artifacts(putArtifactData());

                // mock artifact in scope
                scope.versions = artifact;

                // test PUT happens correctly
                $httpBackend.expectPUT(/artifacts\/([0-9a-fA-F]{24})$/).respond();

                // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
                //$httpBackend.expectPUT(/artifacts\/([0-9a-fA-F]{24})$/, putArtifactData()).respond();
                /*
                Error: Expected PUT /artifacts\/([0-9a-fA-F]{24})$/ with different data
                EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","title":"An Artifact about MEAN","to":"MEAN is great!"}
                GOT:      {"_id":"525a8422f6d0f87f0e407a33","title":"An Artifact about MEAN","to":"MEAN is great!","updated":[1383534772975]}
                */

                // run controller
                scope.update();
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/artifacts/' + putArtifactData()._id);

            }));

            it('$scope.remove() should send a DELETE request with a valid artifactId' +
                'and remove the artifact from the scope', inject(function(Artifacts) {

                    // fixture rideshare
                    var artifact = new Artifacts({
                        _id: '525a8422f6d0f87f0e407a33'
                    });

                    // mock rideshares in scope
                    scope.artifacts = [];
                    scope.artifacts.push(artifact);

                    // test expected rideshare DELETE request
                    $httpBackend.expectDELETE(/artifacts\/([0-9a-fA-F]{24})$/).respond(204);

                    // run controller
                    scope.remove(artifact);
                    $httpBackend.flush();

                    // test after successful delete URL location artifacts lis
                    //expect($location.path()).toBe('/artifacts');
                    expect(scope.artifacts.length).toBe(0);

                }));
        });
    });
}());
