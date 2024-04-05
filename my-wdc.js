$(document).ready(function() {
    var myConnector = tableau.makeConnector();
    myConnector.getSchema = function (schemaCallback) {
        
        var schema = [];
        //Schema
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
            dataType: tableau.dataTypeEnum.float
        });
        schema.push({
            id: "longitude",
            dataType: tableau.dataTypeEnum.float
        });
        schema.push({
            id: "pollutant_id",
            dataType: tableau.dataTypeEnum.string
        });
        schema.push({
            id: "pollutant_min",
            dataType: tableau.dataTypeEnum.float
        });
        schema.push({
            id: "pollutant_max",
            dataType: tableau.dataTypeEnum.float
        });
        schema.push({
            id: "pollutant_avg",
            dataType: tableau.dataTypeEnum.float
        });
        //Callback with the schema
        schemaCallback(schema);
    };
    myConnector.getData = function (table, doneCallback) {
       
        var apiEndpoint = "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json";

        $.getJSON(apiEndpoint, function (data) {
            // Format data properly!
            var formattedData = [];
            $.each(data.records, function (index, record) {
                var formattedRecord = {
                    "example_field_1": record.example_field_1,
                    "example_field_2": parseFloat(record.example_field_2)
                };
                formattedData.push(formattedRecord);
            });
            // Pass data to Tableau
            table.appendRows(formattedData);
            doneCallback();
        });
    };

    // Register connector with Tableau
    tableau.registerConnector(myConnector);

    // Initiate connector
    $("#submitButton").click(function () {
        tableau.connectionName = "My Web Data Connector";
        tableau.submit();
    });
});
