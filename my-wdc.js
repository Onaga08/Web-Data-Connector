$(document).ready(function() {
    // Define the Tableau connector
    var myConnector = tableau.makeConnector();

    // Define the fixed schema
    var schema = [
        { id: "country", dataType: tableau.dataTypeEnum.string },
        { id: "state", dataType: tableau.dataTypeEnum.string },
        { id: "city", dataType: tableau.dataTypeEnum.string },
        { id: "station", dataType: tableau.dataTypeEnum.string },
        { id: "last_update", dataType: tableau.dataTypeEnum.datetime },
        { id: "latitude", dataType: tableau.dataTypeEnum.float },
        { id: "longitude", dataType: tableau.dataTypeEnum.float },
        { id: "pollutant_id", dataType: tableau.dataTypeEnum.string },
        { id: "pollutant_min", dataType: tableau.dataTypeEnum.float },
        { id: "pollutant_max", dataType: tableau.dataTypeEnum.float },
        { id: "pollutant_avg", dataType: tableau.dataTypeEnum.float },
        // Add the required fields specified by Tableau
        { id: "id", dataType: tableau.dataTypeEnum.string },
        { id: "columns", dataType: tableau.dataTypeEnum.string },
        { id: "alias", dataType: tableau.dataTypeEnum.string },
        { id: "description", dataType: tableau.dataTypeEnum.string },
        { id: "incrementColumnId", dataType: tableau.dataTypeEnum.string },
        { id: "joinOnly", dataType: tableau.dataTypeEnum.bool }
    ];

    // Define the schema retrieval function
    myConnector.getSchema = function (schemaCallback) {
        schemaCallback(schema);
    };

    // Define data retrieval function
    myConnector.getData = function (table, doneCallback) {
        var apiEndpoint = "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json";

        $.getJSON(apiEndpoint, function (data) {
            if (data && data.records && data.records.length > 0) {
                var formattedData = [];
                $.each(data.records, function (index, record) {
                    // Replace NA values with null
                    Object.keys(record).forEach(function(key) {
                        if (record[key] === "NA") {
                            record[key] = null;
                        }
                    });
                    formattedData.push(record);
                });
                table.appendRows(formattedData);
            }
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
