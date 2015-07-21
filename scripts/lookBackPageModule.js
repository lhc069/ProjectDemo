
'use strict';
var moduleName = 'ROIClientAppLookBackModule';
angular.module(moduleName, [])
    .controller('backCtrl', ['$scope', '$http','$location', function ($scope, $http, $location) {
        // tooltips
        $scope.brandTooltips = 'brandTooltips';
        $scope.attrTooltips = 'attrTooltips';
        $scope.beginPeriodTooltips = 'beginPeriodTooltips';
        $scope.endPeriodTooltips = 'endPeriodTooltips';
        $scope.spendTooltips = 'spendTooltips';
        $scope.includeTooltips = 'includeTooltips';

        $scope.sldFlg = {
            "sem": -1,
            "dis": -1,
            "soc": -1,
            "aff": -1,
            "par": -1
        };

        $scope.sldChgFlg = {
            "sem": 0,
            "dis": 0,
            "soc": 0,
            "aff": 0,
            "par": 0

        };

        $scope.chgsld = function(sld) {

        };

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
            // change to show endPeriod is current month - 1
            //$scope.lookBack.beginPeriod = new Date(date.getFullYear(), date.getMonth(), 1);
            //$scope.lookBack.endPeriod = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            //$scope.maxDate = new Date();
            $scope.lookBack.beginPeriod = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            $scope.lookBack.endPeriod = new Date(date.getFullYear(), date.getMonth(), 0);
            $scope.maxDate = new Date();
            $scope.maxDate.setMonth($scope.maxDate.getMonth() - 1);

        };
        $scope.open = function ($event, model) {
            $event.preventDefault();
            $event.stopPropagation();

            if (model === 'lookBackBeginPeriod') {
                $scope.opened.lookBackBeginPeriod = !$scope.opened.lookBackBeginPeriod;
                $scope.opened.lookBackEndPeriod = false;
            } else {
                $scope.minDate = new Date($scope.lookBack.beginPeriod);
                $scope.opened.lookBackEndPeriod = !$scope.opened.lookBackEndPeriod;
                $scope.opened.lookBackBeginPeriod = false;
            }
        };
        $scope.getLastDate = function () {
            $scope.lookBack.endPeriod = new Date($scope.lookBack.endPeriod);
            $scope.lookBack.endPeriod = new Date($scope.lookBack.endPeriod.getFullYear(), $scope.lookBack.endPeriod.getMonth() + 1, 0);
        };


        $scope.reRun = function() {
            $scope.lookBack.input.totSB = Number($scope.lookBack.input.semAS)+ Number($scope.lookBack.input.disSB) +
                Number($scope.lookBack.input.socSB) + Number($scope.lookBack.input.affSB) + Number($scope.lookBack.input.parSB);

            if ($scope.lookBack.input.totSB != Number($scope.lookBack.spend)) {
                if (confirm("You are changing the invested spend!") == false) {
                    $scope.reset();
                    return;
                }
            }

            $scope.lookBack.spend = $scope.lookBack.input.totSB;

            $scope.reRunSem();
            $scope.reRunDis();
            $scope.reRunSoc();
            $scope.reRunAff();
            $scope.reRunPar();

            $scope.lookBack.input.totSB = Number($scope.lookBack.input.semAS)+ Number($scope.lookBack.input.disSB) +
                Number($scope.lookBack.input.socSB) + Number($scope.lookBack.input.affSB) + Number($scope.lookBack.input.parSB);

            $scope.lookBack.output.totAR = $scope.lookBack.output.semAR + $scope.lookBack.output.disAR +
                $scope.lookBack.output.socAR + $scope.lookBack.output.affAR + $scope.lookBack.output.parAR;

            $scope.lookBack.output.totSD = $scope.lookBack.input.totSB - $scope.lookBack.actuals.totSpend;
            $scope.lookBack.output.totRD = $scope.lookBack.output.totAR - $scope.lookBack.actuals.totRev;

            $scope.lookBack.output.optimizedROI = parseInt((($scope.lookBack.output.totAR - $scope.lookBack.input.totSB) /
                $scope.lookBack.input.totSB) * 100);

            $scope.lookBack.output.differenceROI= $scope.lookBack.output.optimizedROI - $scope.lookBack.actuals.actualROI;

            //$scope.lookBack.output.optimizedROI = parseInt(((Number($scope.lookBack.output.totAR) - Number($scope.lookBack.input.totSB)) / Number($scope.lookBack.input.totSB)) * 100);

            $scope.compareChartData = [
                {title: "SEM", value: $scope.lookBack.output.semSD},
                {title: "Display", value: $scope.lookBack.output.disSD},
                {title: "Social", value: $scope.lookBack.output.socSD},
                {title: "Affiliates", value: $scope.lookBack.output.affSD},
                {title: "Partners", value: $scope.lookBack.output.parSD},
                {title: "Portfolio Total", value: $scope.lookBack.output.totSD}
            ];

        };

        $scope.reRunSem = function() {
            var numSemActualsSpend = 0;
            var numSemActualsRev = 0;
            var numSemOptimizedSpend = 0;
            var numSemOptimizedRev = 0;
            var numSemAS = 0;
            var numSemAR = 0;
            var numSemSD = 0;
            var numSemRD = 0;

            numSemActualsSpend = Number($scope.lookBack.actuals.semSpend);
            numSemActualsRev = Number($scope.lookBack.actuals.semRev);
            numSemOptimizedSpend = Number($scope.lookBack.optimized.semSpend);
            numSemOptimizedRev = Number($scope.lookBack.optimized.semRev);
            numSemAS = Number($scope.lookBack.input.semAS);

            numSemAR = parseInt(numSemOptimizedRev + (numSemAS - numSemOptimizedSpend) * 4);

            numSemSD = numSemAS - numSemActualsSpend;
            numSemRD = numSemAR - numSemActualsRev;

            //alert("numSemActualsSpend: " + numSemActualsSpend + "\nnumSemActualsRev: " + numSemActualsRev + "\nnumSemOptimizedSpend: " + numSemOptimizedSpend
            //+ "\nnumSemOptimizedRev: " + numSemOptimizedRev + "\nnumSemAS: " + numSemAS + "\nnumSemAR: " + numSemAR + "\nnumSemSD: " + numSemSD + "\nnumSemRD: " + numSemRD);

            $scope.lookBack.output.semAR = numSemAR;
            $scope.lookBack.output.semSD = numSemSD;
            $scope.lookBack.output.semRD = numSemRD;
        };

        $scope.reRunDis = function() {
            var numDisActualsSpend = 0;
            var numDisActualsRev = 0;
            var numDisOptimizedSpend = 0;
            var numDisOptimizedRev = 0;
            var numDisAS = 0;
            var numDisAR = 0;
            var numDisSD = 0;
            var numDisRD = 0;

            numDisActualsSpend = Number($scope.lookBack.actuals.disSpend);
            numDisActualsRev = Number($scope.lookBack.actuals.disRev);
            numDisOptimizedSpend = Number($scope.lookBack.optimized.disSpend);
            numDisOptimizedRev = Number($scope.lookBack.optimized.disRev);
            numDisAS = Number($scope.lookBack.input.disSB);

            numDisAR = parseInt(numDisOptimizedRev + (numDisAS - numDisOptimizedSpend) * 4);

            numDisSD = numDisAS - numDisActualsSpend;
            numDisRD = numDisAR - numDisActualsRev;

            $scope.lookBack.output.disAR = numDisAR;
            $scope.lookBack.output.disSD = numDisSD;
            $scope.lookBack.output.disRD = numDisRD;
        };

        $scope.reRunSoc = function() {
            var numSocActualsSpend = 0;
            var numSocActualsRev = 0;
            var numSocOptimizedSpend = 0;
            var numSocOptimizedRev = 0;
            var numSocAS = 0;
            var numSocAR = 0;
            var numSocSD = 0;
            var numSocRD = 0;

            numSocActualsSpend = Number($scope.lookBack.actuals.socSpend);
            numSocActualsRev = Number($scope.lookBack.actuals.socRev);
            numSocOptimizedSpend = Number($scope.lookBack.optimized.socSpend);
            numSocOptimizedRev = Number($scope.lookBack.optimized.socRev);
            numSocAS = Number($scope.lookBack.input.socSB);

            numSocAR = parseInt(numSocOptimizedRev + (numSocAS - numSocOptimizedSpend) * 4);

            numSocSD = numSocAS - numSocActualsSpend;
            numSocRD = numSocAR - numSocActualsRev;

            $scope.lookBack.output.socAR = numSocAR;
            $scope.lookBack.output.socSD = numSocSD;
            $scope.lookBack.output.socRD = numSocRD;
        };

        $scope.reRunAff = function() {
            var numAffActualsSpend = 0;
            var numAffActualsRev = 0;
            var numAffOptimizedSpend = 0;
            var numAffOptimizedRev = 0;
            var numAffAS = 0;
            var numAffAR = 0;
            var numAffSD = 0;
            var numAffRD = 0;

            numAffActualsSpend = Number($scope.lookBack.actuals.affSpend);
            numAffActualsRev = Number($scope.lookBack.actuals.affRev);
            numAffOptimizedSpend = Number($scope.lookBack.optimized.affSpend);
            numAffOptimizedRev = Number($scope.lookBack.optimized.affRev);
            numAffAS = Number($scope.lookBack.input.affSB);

            numAffAR = parseInt(numAffOptimizedRev + (numAffAS - numAffOptimizedSpend) * 4);

            numAffSD = numAffAS - numAffActualsSpend;
            numAffRD = numAffAR - numAffActualsRev;

            $scope.lookBack.output.affAR = numAffAR;
            $scope.lookBack.output.affSD = numAffSD;
            $scope.lookBack.output.affRD = numAffRD;
        };

        $scope.reRunPar = function() {
            var numParActualsSpend = 0;
            var numParActualsRev = 0;
            var numParOptimizedSpend = 0;
            var numParOptimizedRev = 0;
            var numParAS = 0;
            var numParAR = 0;
            var numParSD = 0;
            var numParRD = 0;

            numParActualsSpend = Number($scope.lookBack.actuals.parSpend);
            numParActualsRev = Number($scope.lookBack.actuals.parRev);
            numParOptimizedSpend = Number($scope.lookBack.optimized.parSpend);
            numParOptimizedRev = Number($scope.lookBack.optimized.parRev);
            numParAS = Number($scope.lookBack.input.parSB);

            numParAR = parseInt(numParOptimizedRev + (numParAS - numParOptimizedSpend) * 4);

            numParSD = numParAS - numParActualsSpend;
            numParRD = numParAR - numParActualsRev;

            $scope.lookBack.output.parAR = numParAR;
            $scope.lookBack.output.parSD = numParSD;
            $scope.lookBack.output.parRD = numParRD;
        };
        // end

        // reset the output form
        $scope.reset = function() {
            $scope.lookBack.spend = $scope.lookBack.actuals.totSpend;

            $scope.lookBack.input.semAS = $scope.lookBack.optimized.semSpend;
            $scope.lookBack.input.disSB = $scope.lookBack.optimized.disSpend;
            $scope.lookBack.input.socSB = $scope.lookBack.optimized.socSpend;
            $scope.lookBack.input.affSB = $scope.lookBack.optimized.affSpend;
            $scope.lookBack.input.parSB = $scope.lookBack.optimized.parSpend;
            $scope.lookBack.output.semAR = $scope.lookBack.optimized.semRev;
            $scope.lookBack.output.disAR = $scope.lookBack.optimized.disRev;
            $scope.lookBack.output.socAR = $scope.lookBack.optimized.socRev;
            $scope.lookBack.output.affAR = $scope.lookBack.optimized.affRev;
            $scope.lookBack.output.parAR = $scope.lookBack.optimized.parRev;

            $scope.lookBack.output.semSD = $scope.lookBack.optimized.semSpendDiff;
            $scope.lookBack.output.disSD = $scope.lookBack.optimized.disSpendDiff;
            $scope.lookBack.output.socSD = $scope.lookBack.optimized.socSpendDiff;
            $scope.lookBack.output.affSD = $scope.lookBack.optimized.affSpendDiff;
            $scope.lookBack.output.parSD = $scope.lookBack.optimized.parSpendDiff;

            $scope.lookBack.output.semRD = $scope.lookBack.optimized.semRevDiff;
            $scope.lookBack.output.disRD = $scope.lookBack.optimized.disRevDiff;
            $scope.lookBack.output.socRD = $scope.lookBack.optimized.socRevDiff;
            $scope.lookBack.output.affRD = $scope.lookBack.optimized.affRevDiff;
            $scope.lookBack.output.parRD = $scope.lookBack.optimized.parRevDiff;

            $scope.lookBack.input.totSB = $scope.lookBack.optimized.totSB;
            $scope.lookBack.output.totAR = $scope.lookBack.optimized.totAR;

            $scope.lookBack.output.totSD = $scope.lookBack.optimized.totSD;
            $scope.lookBack.output.totRD = $scope.lookBack.optimized.totRD;

            $scope.lookBack.output.optimizedROI = $scope.lookBack.optimized.optimizedROI;
            $scope.lookBack.output.differenceROI = $scope.lookBack.optimized.differenceROI;

            $scope.compareChartData = [
                {title: "SEM", value: $scope.lookBack.output.semSD},
                {title: "Display", value: $scope.lookBack.output.disSD},
                {title: "Social", value: $scope.lookBack.output.socSD},
                {title: "Affiliates", value: $scope.lookBack.output.affSD},
                {title: "Partners", value: $scope.lookBack.output.parSD},
                {title: "Portfolio Total", value: $scope.lookBack.output.totSD}
            ];

        };

        // init data default
        $scope.resetForm = function () {
            // Nav bar
            $scope.nav = {};
            $scope.nav.current = 'Initial Input';

            // Data
            $scope.lookBack = {};

            // Brand
            $scope.brands = ['Brilent'];
            $scope.lookBack.brand = $scope.brands[0];

            // Attribution
            $scope.lookBack.attribution = 'LTA';    // $scope.lookBack.attribution = 'MTA';

            //
            $scope.formatInput = function () {
                $scope.lookBack.spend = ($filter('formatCurrency')($scope.lookBack.spend)).substr(1);
            };

            // Include data
            $scope.lookBack.include = true;

            // Calendar
            $scope.today();

            // Table
            $scope.lookBack.input = {};

            // Added by david
            $scope.lookBack.actuals = {};
            $scope.lookBack.optimized = {};
        };
        $scope.resetForm();

        // table
        // sem-brand, sem-card, sem-photobook, sem-other show and hide
        $scope.showSemItems = false;
        $scope.showme = false;
        $scope.lookbackContentSize = 'col-sm-12';
        $scope.showGraph = 'Show Graph';

        $scope.toggle = function() {
            if ($scope.showme == false) {
                $scope.lookbackContentSize = 'col-sm-8';
                $scope.showme = true;
                $scope.showGraph = 'Hide Graph';
            }
            else {
                $scope.lookbackContentSize = 'col-sm-12';
                $scope.showme = false;
                $scope.showGraph = 'Show Graph';
            }
        };

        $scope.calculateActuals = function(amount) {
            $scope.lookBack.actuals.semSpend = parseInt(amount * 0.35);
            $scope.lookBack.actuals.disSpend = parseInt(amount * 0.1);
            $scope.lookBack.actuals.socSpend = parseInt(amount * 0.1);
            $scope.lookBack.actuals.affSpend = parseInt(amount * 0.2);
            $scope.lookBack.actuals.parSpend = parseInt(amount * 0.25);

            $scope.lookBack.actuals.semRev = parseInt(amount * 0.35 * 2.5);
            $scope.lookBack.actuals.disRev = parseInt(amount * 0.1 * 2.5);
            $scope.lookBack.actuals.socRev = parseInt(amount * 0.1 * 2.5);
            $scope.lookBack.actuals.affRev = parseInt(amount * 0.2 * 2.5 );
            $scope.lookBack.actuals.parRev = parseInt(amount * 0.25 * 2.5);

            $scope.lookBack.actuals.totSpend = amount;

            $scope.lookBack.actuals.totRev = $scope.lookBack.actuals.semRev + $scope.lookBack.actuals.disRev +
                $scope.lookBack.actuals.socRev + $scope.lookBack.actuals.affRev + $scope.lookBack.actuals.parRev;

            $scope.lookBack.actuals.actualROI = parseInt((($scope.lookBack.actuals.totRev - $scope.lookBack.actuals.totSpend) /
                $scope.lookBack.actuals.totSpend) * 100);

        };

        $scope.calculateOptimized = function(amount) {
            $scope.lookBack.input.semAS = parseInt(amount * 0.4);
            $scope.lookBack.input.disSB = parseInt(amount * 0.2);
            $scope.lookBack.input.socSB = parseInt(amount * 0.02);
            $scope.lookBack.input.affSB = parseInt(amount * 0.08);
            $scope.lookBack.input.parSB = parseInt(amount * 0.3);

            $scope.lookBack.output.semAR = parseInt(amount * 0.4 * 3.5);
            $scope.lookBack.output.disAR = parseInt(amount * 0.2 * 3.5);
            $scope.lookBack.output.socAR = parseInt(amount * 0.02 * 3.5);
            $scope.lookBack.output.affAR = parseInt(amount * 0.08 * 3.5);
            $scope.lookBack.output.parAR = parseInt(amount * 0.3 * 3.5);

            $scope.lookBack.output.semSD = $scope.lookBack.input.semAS - $scope.lookBack.actuals.semSpend;
            $scope.lookBack.output.disSD = $scope.lookBack.input.disSB - $scope.lookBack.actuals.disSpend;
            $scope.lookBack.output.socSD = $scope.lookBack.input.socSB - $scope.lookBack.actuals.socSpend;
            $scope.lookBack.output.affSD = $scope.lookBack.input.affSB - $scope.lookBack.actuals.affSpend;
            $scope.lookBack.output.parSD = $scope.lookBack.input.parSB - $scope.lookBack.actuals.parSpend;

            $scope.lookBack.output.semRD = $scope.lookBack.output.semAR - $scope.lookBack.actuals.semRev;
            $scope.lookBack.output.disRD = $scope.lookBack.output.disAR - $scope.lookBack.actuals.disRev;
            $scope.lookBack.output.socRD = $scope.lookBack.output.socAR - $scope.lookBack.actuals.socRev;
            $scope.lookBack.output.affRD = $scope.lookBack.output.affAR - $scope.lookBack.actuals.affRev;
            $scope.lookBack.output.parRD = $scope.lookBack.output.parAR - $scope.lookBack.actuals.parRev;

            $scope.lookBack.input.totSB = $scope.lookBack.input.semAS + $scope.lookBack.input.disSB +
                $scope.lookBack.input.socSB + $scope.lookBack.input.affSB + $scope.lookBack.input.parSB;

            $scope.lookBack.output.totAR = $scope.lookBack.output.semAR + $scope.lookBack.output.disAR +
                $scope.lookBack.output.socAR + $scope.lookBack.output.affAR + $scope.lookBack.output.parAR;

            $scope.lookBack.output.optimizedROI = parseInt((($scope.lookBack.output.totAR - $scope.lookBack.input.totSB) /
                $scope.lookBack.input.totSB) * 100);

            $scope.lookBack.output.totSD = $scope.lookBack.input.totSB - $scope.lookBack.actuals.totSpend;
            $scope.lookBack.output.totRD = $scope.lookBack.output.totAR - $scope.lookBack.actuals.totRev;
            $scope.lookBack.output.differenceROI= $scope.lookBack.output.optimizedROI - $scope.lookBack.actuals.actualROI;


            //$scope.lookBack.output.optimizedROI = parseInt((($scope.lookBack.output.semAR + $scope.lookBack.output.disAR +
            //    $scope.lookBack.output.socAR + $scope.lookBack.output.affAR + $scope.lookBack.output.parAR) -
            //    Number($scope.lookBack.spend)) / Number($scope.lookBack.spend) * 100);

            $scope.lookBack.optimized.semSpend = $scope.lookBack.input.semAS;
            $scope.lookBack.optimized.disSpend = $scope.lookBack.input.disSB;
            $scope.lookBack.optimized.socSpend = $scope.lookBack.input.socSB;
            $scope.lookBack.optimized.affSpend = $scope.lookBack.input.affSB;
            $scope.lookBack.optimized.parSpend = $scope.lookBack.input.parSB;
            $scope.lookBack.optimized.semRev = $scope.lookBack.output.semAR;
            $scope.lookBack.optimized.disRev = $scope.lookBack.output.disAR;
            $scope.lookBack.optimized.socRev = $scope.lookBack.output.socAR;
            $scope.lookBack.optimized.affRev = $scope.lookBack.output.affAR;
            $scope.lookBack.optimized.parRev = $scope.lookBack.output.parAR;

            $scope.lookBack.optimized.semSpendDiff = $scope.lookBack.output.semSD;
            $scope.lookBack.optimized.disSpendDiff = $scope.lookBack.output.disSD;
            $scope.lookBack.optimized.socSpendDiff = $scope.lookBack.output.socSD;
            $scope.lookBack.optimized.affSpendDiff = $scope.lookBack.output.affSD;
            $scope.lookBack.optimized.parSpendDiff = $scope.lookBack.output.parSD;

            $scope.lookBack.optimized.semRevDiff = $scope.lookBack.output.semRD;
            $scope.lookBack.optimized.disRevDiff = $scope.lookBack.output.disRD;
            $scope.lookBack.optimized.socRevDiff = $scope.lookBack.output.socRD;
            $scope.lookBack.optimized.affRevDiff = $scope.lookBack.output.affRD;
            $scope.lookBack.optimized.parRevDiff = $scope.lookBack.output.parRD;

            $scope.lookBack.optimized.totSB = $scope.lookBack.input.totSB;
            $scope.lookBack.optimized.totAR = $scope.lookBack.output.totAR;

            $scope.lookBack.optimized.totSD = $scope.lookBack.output.totSD;
            $scope.lookBack.optimized.totRD = $scope.lookBack.output.totRD;

            $scope.lookBack.optimized.optimizedROI = $scope.lookBack.output.optimizedROI;
            $scope.lookBack.optimized.differenceROI = $scope.lookBack.output.differenceROI;


            //$scope.lookBack.optimized.optimizedROI = parseInt((($scope.lookBack.optimized.semRev + $scope.lookBack.optimized.disRev +
            //    $scope.lookBack.optimized.socRev + $scope.lookBack.optimized.affRev + $scope.lookBack.optimized.parRev) -
            //    Number($scope.lookBack.spend)) / Number($scope.lookBack.spend) * 100);


            //$scope.lookBack.output.semAR = parseInt(amount * 0.4 * 2.5 * (1 + Math.random()));
            //$scope.lookBack.output.disAR = parseInt(amount * 0.2 * 2.5 * (1 + Math.random()));
            //$scope.lookBack.output.socAR = parseInt(amount * 0.02 * 2.5 * (1 + Math.random()));
            //$scope.lookBack.output.affAR = parseInt(amount * 0.08 * 2.5 * (1 + Math.random()));
            //$scope.lookBack.output.parAR = parseInt(amount * 0.3 * 2.5 * (1 + Math.random()));
        };

        $scope.chgsld = function(sld) {

        }

        $scope.calculate = function () {
            //$http.get('/ROIClientApp/dummy_data/output/1430764474_63.json').success(function (data) {
            $http.get('/ROIClientApp/dummy_data/output/1431639870_70.json').success(function (data) {
                $scope.lookBack.output = data;
                $scope.lookBack.dataThrough = new Date($scope.lookBack.endPeriod);
                $scope.lookBack.dataThrough.setMonth($scope.lookBack.include ? $scope.lookBack.endPeriod.getMonth() : $scope.lookBack.endPeriod.getMonth() - 1);

                var numSpend = Number($scope.lookBack.spend);

                $scope.calculateActuals(numSpend);
                $scope.calculateOptimized(numSpend);

                $scope.compareChartData = [
                    {title: "SEM", value: $scope.lookBack.output.semSD},
                    {title: "Display", value: $scope.lookBack.output.disSD},
                    {title: "Social", value: $scope.lookBack.output.socSD},
                    {title: "Affiliates", value: $scope.lookBack.output.affSD},
                    {title: "Partners", value: $scope.lookBack.output.parSD},
                    {title: "Portfolio Total", value: $scope.lookBack.output.totSD}
                ];


                // jump to output page
                $scope.nav.current = 'Output';
            });
        };
        $scope.save = function () {
            $location.path('lookback/save');
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
        function formatDateFilter(element, input) {
            switch (element) {
                case 'dd':
                    return input.getDate();
                case 'Month':
                    return input.toDateString().split(' ')[1];
                case 'MM':
                    return input.getMonth() + 1;
                case 'yyyy':
                    return input.getFullYear();
                case 'yy':
                    return input.getYear();
                default :
                    return input.toDateString().split(' ')[1] + "-" + input.getDate() + "-" + input.getFullYear();
            }
        }

        return function (input, formatStr) {
            input = input || new Date();
            var formatDetail = formatStr ? formatStr.split('-') : ['default'];
            var output = "";
            formatDetail.forEach(function (element) {
                output = output + " " + formatDateFilter(element, input);
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