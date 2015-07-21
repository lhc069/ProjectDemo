
'use strict';
var moduleName = 'ROIClientAppPlanForwardModule';
angular.module(moduleName, [])
    .controller('forwardCtrl', ['$scope', '$filter', '$http','$location', function ($scope, $filter, $http,$location) {

        // tooltips
        $scope.brandTooltips = 'brandTooltips';
        $scope.attrTooltips = 'attrTooltips';
        $scope.beginPeriodTooltips = 'beginPeriodTooltips';
        $scope.endPeriodTooltips = 'endPeriodTooltips';
        $scope.spendTooltips = 'spendTooltips';
        $scope.includeTooltips = 'includeTooltips';

        // Calendar settings
        $scope.opened = {};
        $scope.format = 'MMMM-dd-yyyy';
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            minMode: 'month'
        };
        $scope.today = function () {
            var date = new Date();
            $scope.planForward.beginPeriod = new Date(date.getFullYear(), date.getMonth(), 1);
            $scope.planForward.endPeriod = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            $scope.minDate = new Date();
        };
        $scope.open = function ($event, model) {
            $event.preventDefault();
            $event.stopPropagation();

            if (model === 'planForwardBeginPeriod') {
                $scope.opened.planForwardBeginPeriod = !$scope.opened.planForwardBeginPeriod;
                $scope.opened.planForwardEndPeriod = false;
            } else {
                $scope.minDate = new Date($scope.planForward.beginPeriod);
                $scope.opened.planForwardEndPeriod = !$scope.opened.planForwardEndPeriod;
                $scope.opened.planForwardBeginPeriod = false;
            }
        };
        $scope.getLastDate = function () {
            $scope.planForward.endPeriod = new Date($scope.planForward.endPeriod);
            $scope.planForward.endPeriod = new Date($scope.planForward.endPeriod.getFullYear(), $scope.planForward.endPeriod.getMonth() + 1, 0);
        };

        $scope.showme = false;
        $scope.planforwardContentSize = 'col-sm-12';
        $scope.showGraph = 'Show Graph';

        $scope.toggle = function() {
            if ($scope.showme == false) {
                $scope.planforwardContentSize = 'col-sm-8';
                $scope.showme = true;
                $scope.showGraph = 'Hide Graph';
            }
            else {
                $scope.planforwardContentSize = 'col-sm-12';
                $scope.showme = false;
                $scope.showGraph = 'Show Graph';
            }
        };



        // init data default
        $scope.resetForm = function () {
            // Nav bar
            $scope.nav = {};
            $scope.nav.current = 'Initial Input';

            // Data
            $scope.planForward = {};

            // Brand
            $scope.brands = ['Brilent'];
            $scope.planForward.brand = $scope.brands[0];

            // Attribution
            $scope.planForward.attribution = 'LTA';

            //
            $scope.formatInput = function () {
                $scope.planForward.spend = ($filter('formatCurrency')($scope.planForward.spend)).substr(1);
            };

            // Calendar
            $scope.today();

            // init data output
            $scope.planForward.input = {};
        };
        $scope.resetForm();

        $scope.CInput = function () {
            var length = ($scope.planForward.endPeriod.getFullYear() - $scope.planForward.beginPeriod.getFullYear()) * 12 + ($scope.planForward.endPeriod.getMonth() - $scope.planForward.beginPeriod.getMonth()) + 1;
            $scope.planForward.ControlChannels = [];
            for (var i = 0; i < length; i++) {
                var d = new Date($scope.planForward.beginPeriod);
                d.setMonth(($scope.planForward.beginPeriod.getMonth() + i) % 12);
                d.setFullYear($scope.planForward.beginPeriod.getFullYear() + Math.floor(($scope.planForward.beginPeriod.getMonth() + i) / 12));
                $scope.planForward.ControlChannels.push(d);
            }

            // init plan forward select plan all checked
            $scope.planForward.selectPlan = {};
            $scope.planForward.selectPlan.semTotal = true;
            $scope.planForward.selectPlan.semBrand = true;
            $scope.planForward.selectPlan.semCard = true;
            $scope.planForward.selectPlan.semPhotobook = true;
            $scope.planForward.selectPlan.semOthers = true;
            $scope.planForward.selectPlan.display = true;
            $scope.planForward.selectPlan.social = true;
            $scope.planForward.selectPlan.affiliates = true;
            $scope.planForward.selectPlan.partners = true;

            // get data

            //$http.get('/ROIClientApp/dummy_data/output/1430764474_63.json').success(function (data) {
            $http.get('/ROIClientApp/dummy_data/output/1431639870_70.json').success(function (data) {
                $scope.planForward.output = data;
                $scope.planForward.dataThrough = new Date($scope.planForward.endPeriod);
                $scope.planForward.dataThrough.setMonth($scope.planForward.include ? $scope.planForward.endPeriod.getMonth() : $scope.planForward.endPeriod.getMonth() - 1);

                // set default value of input
                $scope.planForward.input.semMin = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                $scope.planForward.input.semMax = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);
                $scope.planForward.input.disMin = Number($scope.planForward.output.disLB);
                $scope.planForward.input.disMax = Number($scope.planForward.output.disUB);
                $scope.planForward.input.socMin = Number($scope.planForward.output.socLB);
                $scope.planForward.input.socMax = Number($scope.planForward.output.socUB);
                $scope.planForward.input.affMin = Number($scope.planForward.output.affLB);
                $scope.planForward.input.affMax = Number($scope.planForward.output.affUB);
                $scope.planForward.input.parMin = Number($scope.planForward.output.parLB);
                $scope.planForward.input.parMax = Number($scope.planForward.output.parUB);
            });
            $scope.nav.current = 'Constraints Input';
        };

        $scope.totCheck = function () {
            if (!$scope.planForward.selectPlan.semTotal) {
                Object.keys($scope.planForward.selectPlan).forEach(function (key) {
                    $scope.planForward.selectPlan[key] = key.toString().indexOf('sem') < 0 ? $scope.planForward.selectPlan[key] : false;
                });
            } else {
                Object.keys($scope.planForward.selectPlan).forEach(function (key) {
                    $scope.planForward.selectPlan[key] = key.toString().indexOf('sem') < 0 ? $scope.planForward.selectPlan[key] : true;
                });
            }
            $scope.semTSP = !$scope.semTSP;
        };
        $scope.subCheck = function () {
            $scope.planForward.selectPlan.semTotal = !!($scope.planForward.selectPlan.semBrand && $scope.planForward.selectPlan.semCard && $scope.planForward.selectPlan.semPhotobook && $scope.planForward.selectPlan.semOthers);
        };

        $scope.calculateOptimized = function(amount) {

            $scope.planForward.output.semSR = parseInt(amount * 0.4);
            $scope.planForward.output.disSR = parseInt(amount * 0.2);
            $scope.planForward.output.socSR = parseInt(amount * 0.02);
            $scope.planForward.output.affSR = parseInt(amount * 0.08);
            $scope.planForward.output.parSR = parseInt(amount * 0.3);

            $scope.planForward.output.semPR = parseInt(amount * 0.4 * 3.5);
            $scope.planForward.output.disPR = parseInt(amount * 0.2 * 3.5);
            $scope.planForward.output.socPR = parseInt(amount * 0.02 * 3.5);
            $scope.planForward.output.affPR = parseInt(amount * 0.08 * 3.5);
            $scope.planForward.output.parPR = parseInt(amount * 0.3 * 3.5);

            $scope.planForward.output.totSR = amount;
            $scope.planForward.output.totPR = $scope.planForward.output.semPR + $scope.planForward.output.disPR +
                $scope.planForward.output.socPR + $scope.planForward.output.affPR + $scope.planForward.output.parPR;

            // actually here is optimized, but use actual here. for what if, naming as optimized. Need to change name later for understand easily
            $scope.planForward.output.actualROI = parseInt((($scope.planForward.output.totPR - $scope.planForward.output.totSR) /
                $scope.planForward.output.totSR) * 100);

        };

        // added by david
        $scope.reRun = function() {

            $scope.reRunSem();
            $scope.reRunDis();
            $scope.reRunSoc();
            $scope.reRunAff();
            $scope.reRunPar();

            $scope.planForward.input.totAS = Number($scope.planForward.input.semAS)+ Number($scope.planForward.input.disAS) +
                Number($scope.planForward.input.socAS) + Number($scope.planForward.input.affAS) + Number($scope.planForward.input.parAS);

            $scope.planForward.output.totAR = $scope.planForward.output.semAR + $scope.planForward.output.disAR +
                $scope.planForward.output.socAR + $scope.planForward.output.affAR + $scope.planForward.output.parAR;

            $scope.planForward.output.totSD = $scope.planForward.input.totAS - $scope.planForward.output.totSR;
            $scope.planForward.output.totRD = $scope.planForward.output.totAR - $scope.planForward.output.totPR;

            $scope.planForward.output.optimizedROI = parseInt((($scope.planForward.output.totAR - $scope.planForward.input.totAS) /
                $scope.planForward.input.totAS) * 100);

            $scope.planForward.output.differenceROI= $scope.planForward.output.optimizedROI - $scope.planForward.output.actualROI;

            $scope.planForward.spend = $scope.planForward.input.totAS;

            $scope.compareChartData = [
                {title: "SEM", value: $scope.planForward.output.semSD},
                {title: "Display", value: $scope.planForward.output.disSD},
                {title: "Social", value: $scope.planForward.output.socSD},
                {title: "Affiliates", value: $scope.planForward.output.affSD},
                {title: "Partners", value: $scope.planForward.output.parSD},
                {title: "Portfolio Total", value: $scope.planForward.output.totSD}
            ];
        };

        $scope.reRunSem = function() {

            var numSemSR = 0;
            var numSemPR = 0;
            var numSemAS = 0;
            var numSemAR = 0;
            var numSemSD = 0;
            var numSemRD = 0;

            numSemSR = Number($scope.planForward.output.semSR);
            numSemPR = Number($scope.planForward.output.semPR);
            numSemAS = Number($scope.planForward.input.semAS);

            numSemAR = parseInt(numSemPR + (numSemAS - numSemSR) * 4);
            numSemSD = numSemAS - numSemSR;
            numSemRD = numSemAR - numSemPR;

            $scope.planForward.output.semAR = numSemAR;
            $scope.planForward.output.semSD = numSemSD;
            $scope.planForward.output.semRD = numSemRD;
        };

        $scope.reRunDis = function() {

            var numDisSR = 0;
            var numDisPR = 0;
            var numDisAS = 0;
            var numDisAR = 0;
            var numDisSD = 0;
            var numDisRD = 0;

            numDisSR = Number($scope.planForward.output.disSR);
            numDisPR = Number($scope.planForward.output.disPR);
            numDisAS = Number($scope.planForward.input.disAS);

            numDisAR = parseInt(numDisPR + (numDisAS - numDisSR) * 4);
            numDisSD = numDisAS - numDisSR;
            numDisRD = numDisAR - numDisPR;

            $scope.planForward.output.disAR = numDisAR;
            $scope.planForward.output.disSD = numDisSD;
            $scope.planForward.output.disRD = numDisRD;
        };

        $scope.reRunSoc = function() {

            var numSocSR = 0;
            var numSocPR = 0;
            var numSocAS = 0;
            var numSocAR = 0;
            var numSocSD = 0;
            var numSocRD = 0;

            numSocSR = Number($scope.planForward.output.socSR);
            numSocPR = Number($scope.planForward.output.socPR);
            numSocAS = Number($scope.planForward.input.socAS);

            numSocAR = parseInt(numSocPR + (numSocAS - numSocSR) * 4);
            numSocSD = numSocAS - numSocSR;
            numSocRD = numSocAR - numSocPR;

            $scope.planForward.output.socAR = numSocAR;
            $scope.planForward.output.socSD = numSocSD;
            $scope.planForward.output.socRD = numSocRD;
        };

        $scope.reRunAff = function() {

            var numAffSR = 0;
            var numAffPR = 0;
            var numAffAS = 0;
            var numAffAR = 0;
            var numAffSD = 0;
            var numAffRD = 0;

            numAffSR = Number($scope.planForward.output.affSR);
            numAffPR = Number($scope.planForward.output.affPR);
            numAffAS = Number($scope.planForward.input.affAS);

            numAffAR = parseInt(numAffPR + (numAffAS - numAffSR) * 4);
            numAffSD = numAffAS - numAffSR;
            numAffRD = numAffAR - numAffPR;

            $scope.planForward.output.affAR = numAffAR;
            $scope.planForward.output.affSD = numAffSD;
            $scope.planForward.output.affRD = numAffRD;
        };

        $scope.reRunPar = function() {

            var numParSR = 0;
            var numParPR = 0;
            var numParAS = 0;
            var numParAR = 0;
            var numParSD = 0;
            var numParRD = 0;

            numParSR = Number($scope.planForward.output.parSR);
            numParPR = Number($scope.planForward.output.parPR);
            numParAS = Number($scope.planForward.input.parAS);

            numParAR = parseInt(numParPR + (numParAS - numParSR) * 4);
            numParSD = numParAS - numParSR;
            numParRD = numParAR - numParPR;

            $scope.planForward.output.parAR = numParAR;
            $scope.planForward.output.parSD = numParSD;
            $scope.planForward.output.parRD = numParRD;
        };

        $scope.reset = function() {

            $scope.planForward.spend = $scope.planForward.output.totSR;
            $scope.calculate();
        }


        $scope.calculate = function(){
            var numSpend = Number($scope.planForward.spend);
            $scope.calculateOptimized(numSpend);

            // init what-if data
            $scope.planForward.input.semAS = Number($scope.planForward.output.semSR);
            $scope.planForward.input.disAS = Number($scope.planForward.output.disSR);
            $scope.planForward.input.socAS = Number($scope.planForward.output.socSR);
            $scope.planForward.input.affAS = Number($scope.planForward.output.affSR);
            $scope.planForward.input.parAS = Number($scope.planForward.output.parSR);

            $scope.planForward.output.semAR = Number($scope.planForward.output.semPR);
            $scope.planForward.output.disAR = Number($scope.planForward.output.disPR);
            $scope.planForward.output.socAR = Number($scope.planForward.output.socPR);
            $scope.planForward.output.affAR = Number($scope.planForward.output.affPR);
            $scope.planForward.output.parAR = Number($scope.planForward.output.parPR);

            $scope.planForward.output.semSD = 0;
            $scope.planForward.output.disSD = 0;
            $scope.planForward.output.socSD = 0;
            $scope.planForward.output.affSD = 0;
            $scope.planForward.output.parSD = 0;

            $scope.planForward.output.semRD = 0;
            $scope.planForward.output.disRD = 0;
            $scope.planForward.output.socRD = 0;
            $scope.planForward.output.affRD = 0;
            $scope.planForward.output.parRD = 0;

            $scope.planForward.input.totAS = Number($scope.planForward.output.totSR);
            $scope.planForward.output.totAR = Number($scope.planForward.output.totPR);
            $scope.planForward.output.totSD = 0;
            $scope.planForward.output.totRD = 0;

            $scope.planForward.output.optimizedROI = $scope.planForward.output.actualROI;
            $scope.planForward.output.differenceROI = 0; //$scope.lookBack.output.optimizedROI - $scope.planForward.output.actualROI;

            $scope.compareChartData = [
                {title: "SEM", value: $scope.planForward.output.semSD},
                {title: "Display", value: $scope.planForward.output.disSD},
                {title: "Social", value: $scope.planForward.output.socSD},
                {title: "Affiliates", value: $scope.planForward.output.affSD},
                {title: "Partners", value: $scope.planForward.output.parSD},
                {title: "Portfolio Total", value: $scope.planForward.output.totSD}
            ];





            $scope.nav.current='Output'
        };
        $scope.save = function(){
            $location.path('planforward/save');
        }
    }])
    .directive('formatInput', ['$filter', function ($filter) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                if (!ngModel) return;

                ngModel.$formatters.unshift(function (a) {
                    return $filter('formatCurrency')(ngModel.$modelValue)
                });

                ngModel.$parsers.unshift(function (viewValue) {
                    var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                    elem.val($filter('formatCurrency')(plainNumber));
                    return plainNumber;
                });
            }
        };
    }])
    .directive('stringToNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    return parseFloat(value, 10);
                });
            }
        };
    })
    .filter('formatDate', function () {
        function format(element, input) {
            switch (element) {
                case 'Month':
                    return input.toDateString().split(' ')[1];
                case 'MM':
                    return input.getMonth() + 1;
                case 'yyyy':
                    return input.getFullYear();
                case 'yy':
                    return input.getYear();
                default :
                    return input.toDateString().split(' ')[1] + "-" + input.getFullYear();
            }
        }

        return function (input, formatStr) {
            input = input || new Date();
            var formatDetail = formatStr ? formatStr.split('-') : ['default'];
            var output = "";
            formatDetail.forEach(function (element) {
                output = output + " " + format(element, input);
            });
            return output;
        };
    })
    .filter('formatCurrency', function () {
        return function (input) {
            input = input || 0;
            if (typeof input === 'string') {
                input = input.split(',').join('');
            }
            var output = Number(input).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').toString();
            return "$" + output.substr(0, output.length - 3);
        }
    })
    .value('compareChartConfig', {
        width: 360,
        height: 450,
        margin: {left: 0, top: 80, right: 0, bottom: 30}
    });