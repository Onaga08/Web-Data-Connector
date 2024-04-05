$(document).ready(function() {
    // Define the Tableau connector
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        var schema = [];
        // Define each field in the schema
        schema.push({
            id: "country",
            dataType: tableau.dataTypeEnum.string
        });
        schema.push({
            id: "state",
            dataType: tableau.dataTypeEnum.string
        });
        schema.push({
            id: "city",
            dataType: tableau.dataTypeEnum.string
        });
        schema.push({
            id: "station",
            dataType: tableau.dataTypeEnum.string
        });
        schema.push({
            id: "last_update",
            dataType: tableau.dataTypeEnum.datetime
        });
        schema.push({
            id: "latitude",
            dataType: tableau.dataTypeEnum.numeric
        });
        schema.push({
            id: "longitude",
            dataType: tableau.dataTypeEnum.numeric
        });
        schema.push({
            id: "pollutant_id",
            dataType: tableau.dataTypeEnum.string
        });
        schema.push({
            id: "pollutant_min",
            dataType: tableau.dataTypeEnum.numeric
        });
        schema.push({
            id: "pollutant_max",
            dataType: tableau.dataTypeEnum.numeric
        });
        schema.push({
            id: "pollutant_avg",
            dataType: tableau.dataTypeEnum.numeric
        });
        // Callback with the schema
        schemaCallback(schema);
    };

    // Define data retrieval function
    myConnector.getData = function (table, doneCallback) {
        var apiEndpoint = "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json";

        $.getJSON(apiEndpoint, function (data) {
            // Format data properly
            var formattedData = [];
            $.each(data.records, function (index, record) {
                var formattedRecord = {
                    "country": record.country,
                    "state": record.state,
                    "city": record.city,
                    "station": record.station,
                    "last_update": new Date(record.last_update),
                    "latitude": parsenumeric(record.latitude),
                    "longitude": parsenumeric(record.longitude),
                    "pollutant_id": record.pollutant_id,
                    "pollutant_min": parsenumeric(record.pollutant_min),
                    "pollutant_max": parsenumeric(record.pollutant_max),
                    "pollutant_avg": parsenumeric(record.pollutant_avg)
                };
                formattedData.push(formattedRecord);
            });
            // Pass data to Tableau
            table.appendRows(formattedData);
            doneCallback();
        });
    };

    // Register the connector with Tableau
    tableau.registerConnector(myConnector);

    // Event listener for submit button click
    $("#submitButton").click(function () {
        tableau.connectionName = "My Web Data Connector";
        tableau.submit();
    });
});
