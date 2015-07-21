
angular.module('CompareChart', [])
    .directive('compareChart',['compareChartConfig',function (configData) {
        return {
            restrict: 'EA',
            link: function (scope) {
                var data = scope.compareChartData;
                var barHeight = (configData.height - configData.margin.top - configData.margin.bottom) / data.length;
                var textHeight = 20;
                var textMargin = 2;
                var midX = (configData.width + configData.margin.left - configData.margin.right) / 2;
                var oldScaleFactor;

                function renderChart(data, oldData) {
                    var scaleFactor;
                    var maxValue = 0;
                    data.forEach(function (item) {
                        maxValue = Math.max(maxValue, Math.abs(item.value));
                    });
                    scaleFactor = (configData.width - configData.margin.left - configData.margin.right) / 2 / maxValue;
                    d3.select('#chart').select('svg').remove();
                    var chartSvg = d3.select('#chart')
                        .append("svg");
                    chartSvg.attr("width", configData.width)
                        .attr("height", configData.height);


                    data.forEach(function (item, index) {
                        //draw scale
                        var scale = chartSvg.append('line');
                        scale.attr('x1', midX - 10).attr('y1', barHeight * index + configData.margin.top)
                            .attr('x2', midX + 10).attr('y2', barHeight * index + configData.margin.top)
                            .attr("stroke-width", 1)
                            .attr("stroke", "black");
                        //end scale
                        //draw background rectangle
                        var bgRect = chartSvg
                            .append('rect')
                            .attr('x', configData.margin.left)
                            .attr('y', barHeight * index + textHeight + configData.margin.top + textMargin)
                            .attr('width', configData.width - configData.margin.left - configData.margin.right)
                            .attr('height', barHeight - textHeight - textMargin)
                            .style('fill', '#eeeeee');
                        //end background
                        //draw rectangle
                        var rect = chartSvg
                            .append('rect')
                            .attr("y", barHeight * index + textHeight + configData.margin.top + textMargin)
                            .attr("height", barHeight - textHeight - textMargin)
                            .style('fill', 'darkorange');
                        //render title text
                        var titleText = chartSvg.append('text');
                        titleText.text(item.title)
                            .attr('x', midX)
                            .attr('y', barHeight * index + configData.margin.top + textHeight)
                            .attr('font-size', "14px")
                            .attr('text-anchor', "end");
                        //end text
                        //render value text
                        var valueText = chartSvg.append('text');
                        valueText.text(Math.abs(item.value))
                            .attr('font-size', "14px")
                            .attr('fill', 'royalblue')
                            .attr('x', Number(oldData[index].value) * oldScaleFactor + midX)
                            .attr('y', barHeight * index + configData.margin.top + textHeight + barHeight / 2)
                            .transition()
                            .attr('x', Number(item.value) * scaleFactor + midX);
                        //end text
                        if (item.value > 0) {
                            rect.attr("x", midX)
                                .attr("width", oldData[index].value * oldScaleFactor)
                                .transition()
                                .attr("width", item.value * scaleFactor);
                            valueText.attr('text-anchor', 'end')
                        } else {
                            rect.attr("width", Math.abs(oldData[index].value) * oldScaleFactor)
                                .attr("x", midX + Number(oldData[index].value) * oldScaleFactor)
                                .transition()
                                .attr("width", Math.abs(item.value) * scaleFactor)
                                .attr("x", midX + Number(item.value) * scaleFactor);
                        }
                        //end rectangle
                    });

                    var xAxis = chartSvg.append('line');
                    xAxis.attr('x1', configData.margin.left).attr('y1', configData.height - configData.margin.bottom)
                        .attr('x2', configData.width - configData.margin.right).attr('y2', configData.height - configData.margin.bottom)
                        .attr("stroke-width", 1)
                        .attr("stroke", "black");

                    var yAxis = chartSvg.append('line');
                    yAxis.attr('x1', midX).attr('y1', configData.margin.top)
                        .attr('x2', midX).attr('y2', configData.height - configData.margin.bottom + 10)
                        .attr("stroke-width", 1)
                        .attr("stroke", "black");

                    oldScaleFactor = scaleFactor;
                }

                scope.$watch('compareChartData', function (newValue, oldValue) {
                    renderChart(newValue, oldValue)
                }, true);
            },
            template: '<div id="chart"></div>'
        }
    }]);