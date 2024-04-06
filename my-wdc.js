$(document).ready(function() {
    // Define the Tableau connector
    var myConnector = tableau.makeConnector();

    // Define the fixed schema
    var schema = [
        { id: "icao24", dataType: tableau.dataTypeEnum.string },
        { id: "callsign", dataType: tableau.dataTypeEnum.string },
        { id: "origin_country", dataType: tableau.dataTypeEnum.string },
        { id: "time_position", dataType: tableau.dataTypeEnum.datetime },
        { id: "last_contact", dataType: tableau.dataTypeEnum.datetime },
        { id: "longitude", dataType: tableau.dataTypeEnum.float },
        { id: "latitude", dataType: tableau.dataTypeEnum.float },
        { id: "baro_altitude", dataType: tableau.dataTypeEnum.float },
        { id: "on_ground", dataType: tableau.dataTypeEnum.bool },
        { id: "velocity", dataType: tableau.dataTypeEnum.float },
        { id: "true_track", dataType: tableau.dataTypeEnum.float },
        { id: "vertical_rate", dataType: tableau.dataTypeEnum.float },
        { id: "sensors", dataType: tableau.dataTypeEnum.int }
    ];

    // Define the schema retrieval function
    myConnector.getSchema = function (schemaCallback) {
        schemaCallback(schema);
    };

    // Define data retrieval function
    myConnector.getData = function (table, doneCallback) {
        // Use jQuery AJAX to fetch data
        $.ajax({
            url: "https://opensky-network.org/api/states/all",
            method: "GET",
            dataType: "json",
            success: function(data) {
                if (data && data.states && data.states.length > 0) {
                    var formattedData = [];
                    $.each(data.states, function (index, state) {
                        formattedData.push(state);
                    });
                    table.appendRows(formattedData);
                }
                doneCallback();
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error("Failed to fetch data:", errorThrown);
                doneCallback();
            }
        });
    };

    // Register the connector with Tableau
    tableau.registerConnector(myConnector);

    // Event listener for submit button click
    $("#submitButton").click(function () {
        tableau.connectionName = "OpenSky Network Data";
        tableau.submit();
    });
});
