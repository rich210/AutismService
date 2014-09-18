var clientIntakewebservice = "http://137.135.46.61/ClientIntake/esscDWHService.svc";
var arrayStaffSchedule = [];
var arrayStatus = [];
var clientSiteUrl = "/Clients/";
var isStaffSessionLog = true;
var CISLogingName = "carlos.acevedo";

function initStaffSessionLog() {
    startStaffSessionLog();
    arrayStatus[0] = "Pending";
    arrayStatus[1] = "Cancelled";
    arrayStatus[2] = "Client Cancellation";
    arrayStatus[3] = "Staff Cancellation";
    arrayStatus[4] = "Complete w/o signature";
    arrayStatus[5] = "Signed";
    arrayStatus[6] = "Processed"
}

function startStaffSessionLog() {
    $('#Intake-System-StaffSession-Log-Schedule').footable();
    $('#staff-session-date').datepicker({
        effect: "fade", format: "mm/dd/yyyy", selected: function (dateString, dateObject) {
            loadStafflog();
        }
    });
    $("#Intake-System-StaffSession-Daly-Signature").on('click', function () {
        getStaffSchedulingByDate();
    });

    //$("#createFlatWindow").on('click', function () {
    //    $.Dialog({
    //        overlay: true,
    //        shadow: true,
    //        flat: true,
    //        draggable: true,
    //        width: 500,
    //        //icon: '<img src="images/excel2013icon.png">',
    //        title: 'Unscheduled Appointment',
    //        content: '',
    //        padding: 10,
    //        onShow: function (_dialog) {
    //            var content = '<form class="user-input">' +
    //            '<label>Client</label>' +
    //            '<div class="input-control text"><input type="text" name="login"><button class="btn-clear"></button></div>' +
    //            '<label>Authorization</label>' +
    //            '<div class="input-control select"><select><option>Value 1</option><option>Value 2</option><option>Value 3</option></select></div>' +
    //            '<label>Provider</label>' +
    //            '<div class="input-control select"><select><option>Value 1</option><option>Value 2</option><option>Value 3</option></select></div>' +
    //            '<label>Date</label>' +
    //            '<div class="input-control text" id="Actualdate"><input type="text"><a class="btn-date"></a></div>' +
    //            '<label>Begin Time</label>' +
    //            '<div class="input-control text"><input type="text" name="begintime"><button class="btn-clear"></button></div>' +
    //            '<label>End Time</label>' +
    //            '<div class="input-control text"><input type="text" name="endtime"><button class="btn-clear"></button></div>' +
    //            '<label>Status</label>' +
    //            '<div class="input-control select"><select><option>Pending</option><option>Client Cancellation</option><option>Staff Cancellation</option><option>Complete w/o signature</option><option>Signature</option></select></div>' +
    //            '<label>Parent/Guardian Signature</label>' +
    //            '<div id="signatureparent"><div id="signature"></div></div>' +
    //            '<div class="form-actions">' +
    //            '<button class="button primary">Save</button>&nbsp;' +
    //            '<button class="button" type="button" onclick="$.Dialog.close()">Cancel</button> ' +
    //            '</div>' +
    //            '</form>';
    //            $.Dialog.title("Unscheduled Appointment");
    //            $.Dialog.content(content);
    //            $.Metro.initInputs();
    //            $("#Actualdate").datepicker({ position: "top", effect: "fade", });
    //            $("#signature").jSignature();
    //            //$('#signature').jSignature('getData');
    //        }
    //    });
    //});

    //$("#Addunscheduled").on('click', function () {

    //    $.ajax({
    //        dataType: "jsonp",
    //        url: clientIntakewebservice + '/GetAuthorizationsByClientID?callback=ProcessResponseAuthorizationsNumbers&$format=json&clientId=' + clientInformationID,
    //        cache: false,
    //        jsonp: false,
    //        data: {},
    //        jsonpCallback: "ProcessResponseAuthorizationsNumbers"
    //    });
    //});
    //loadStafflog();

}

var authNumbershtml = "";
function ProcessResponseAuthorizationsNumbers(result) {

    var authNumbers = $.parseJSON(result);

    if (authNumbers.length > 0)
        authNumbershtml = "";
    else
        authNumbershtml = '<option value="No available">No available</option>';

    $.each(authNumbers, function (i, a) {
        authNumbershtml += "<option data-dis='" + a.Discipline + "' value='" + a.AuthorizationNumber + "'>" + a.AuthorizationNumber + "</option>";
    });

    if (authNumbers.length > 0) {
        $.ajax({
            dataType: "jsonp",
            url: clientIntakewebservice + '/GetCPTCodesByDisciplineId?callback=ProcessResponseCPTCodes&$format=json&disciplineId=' + authNumbers[0].Discipline,
            cache: false,
            jsonp: false,
            data: {},
            jsonpCallback: "ProcessResponseCPTCodes"
        });
    }
    else {
        $.Dialog({
            overlay: true,
            shadow: true,
            flat: true,
            draggable: true,
            width: 500,
            //icon: '<img src="images/excel2013icon.png">',
            title: 'Unscheduled Appointment',
            content: '',
            padding: 10,
            onShow: function (_dialog) {
                var content = '<form class="user-input">' +
                '<label>Employee</label>' +
                '<div class="input-control text"><input type="text" name="employee" id="Schedule-Employee" value="' + CISTitleName + '"><button class="btn-clear"></button></div>' +
                '<label>Authorization</label>' +
                '<div class="input-control select"><select id="Schedule-Authorization">' + authNumbershtml + '</select></div>' +
                '<label>CPT Code</label>' +
                '<div class="input-control select"><select id="Schedule-CPTCode"><option value="No available">No available</option></select></div>' +
                '<label>Date</label>' +
                '<div class="input-control text" id="Schedule-BeginDatediv" style="width:200px;"><input type="text" id="Schedule-BeginDate" ><a class="btn-date"></a></div>' +
                '<label>Begin Time</label>' +
                '<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-BeginDate-Hour">' + getTimevalues_Hour() + '</select></div>' +
                '<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-BeginDate-Min">' + getTimevalues_Min() + '</select></div>' +
                '<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-BeginDate-State"><option value="AM">AM</option><option value="PM">PM</option></select></div>' +
                '<label>End Time</label>' +
                //'<div class="input-control text" id="Schedule-EndDatediv" style="width:200px;"><input type="text"  id="Schedule-EndDate" ><a class="btn-date"></a></div>' +
                '<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-EndDate-Hour">' + getTimevalues_Hour() + '</select></div>' +
                '<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-EndDate-Min">' + getTimevalues_Min() + '</select></div>' +
                '<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-EndDate-State"><option value="AM">AM</option><option value="PM">PM</option></select></div>' +
                '<div class="form-actions">' +
                '<a class="button primary" onclick="saveScheduleSession()">Save</a>&nbsp;' +
                '<a class="button" type="button" onclick="$.Dialog.close()">Cancel</a> ' +
                '</div>' +
                '</form>';
                $.Dialog.title("Unscheduled Appointment");
                $.Dialog.content(content);
                $.Metro.initInputs();
                eventformschedule();
                $("#Schedule-BeginDatediv").datepicker({ position: "top", effect: "fade", format: "mm/dd/yyyy" });
                $("#Schedule-EndDatediv").datepicker({ position: "top", effect: "fade", format: "mm/dd/yyyy" });
                //$('#signature').jSignature('getData');
            }
        });
    }
}

var cptcodeshtml = "";
function ProcessResponseCPTCodes(result) {
    var cptCodes = $.parseJSON(result);
    if (cptCodes.length > 0)
        cptcodeshtml = "";
    else
        cptcodeshtml = '<option value="No available">No available</option>';
    $.each(cptCodes, function (i, c) {
        cptcodeshtml += "<option value='" + c.CPTCode + "'>" + c.CPTCode + "</option>";
    });
    $.Dialog({
        overlay: true,
        shadow: true,
        flat: true,
        draggable: true,
        width: 500,
        //icon: '<img src="images/excel2013icon.png">',
        title: 'Unscheduled Appointment',
        content: '',
        padding: 10,
        onShow: function (_dialog) {
            var content = '<style>.ui-autocomplete { background:white; max-height: 250px; overflow-y: auto; /* prevent horizontal scrollbar / overflow-x: hidden; / add padding to account for vertical scrollbar / padding-right: 20px; z-index:1003 !important; z-index:1003; } / Option */ .ui-autocomplete-loading { background: white url(images/loader.gif) right center no-repeat; }</style>' +
			'<form id="dialogInput" class="user-input">' +
            '<label>Employee</label>' +
            '<div class="input-control select"><select id="Schedule-EmployeeID"></select></div>' +
			'<div class="input-control text" id="Schedule-Employee-c" style="display:none"><input type="text" name="employee" id="Schedule-Employee" value="" placeholder="Type the name..."><button class="btn-clear"></button></div>' +
            '<label>Authorization</label>' +
            '<div class="input-control select"><select id="Schedule-Authorization">' + authNumbershtml + '</select></div>' +
            '<label>CPT Code</label>' +
            '<div class="input-control select"><select id="Schedule-CPTCode">' + cptcodeshtml + '</select></div>' +
            '<label>Date</label>' +
            '<div class="input-control text" id="Schedule-BeginDatediv" style="width:200px;"><input type="text" id="Schedule-BeginDate" ><a class="btn-date"></a></div>' +
            '<label>Begin Time</label>' +
            '<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-BeginDate-Hour">' + getTimevalues_Hour() + '</select></div>' +
            '<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-BeginDate-Min">' + getTimevalues_Min() + '</select></div>' +
            '<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-BeginDate-State"><option value="AM">AM</option><option value="PM">PM</option></select></div>' +
            '<label>End Time</label>' +
            '<div class="input-control text" id="Schedule-EndDatediv" style="width:200px;"><input type="text"  id="Schedule-TimeEnd" ></div>' +
            //'<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-EndDate-Hour">' + getTimevalues_Hour() + '</select></div>' +
            //'<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-EndDate-Min">' + getTimevalues_Min() + '</select></div>' +
            //'<div class="input-control select" style="width:60px;margin-left: 10px;"><select id="Schedule-EndDate-State"><option value="AM">AM</option><option value="PM">PM</option></select></div>' +
            '<div class="form-actions">' +
            '<a class="button primary" onclick="saveScheduleSession()">Save</a>&nbsp;' +
            '<a class="button" type="button" onclick="$.Dialog.close()">Cancel</a> ' +
            '</div>' +
            '</form>';
            $.Dialog.title("Unscheduled Appointment");
            $.Dialog.content(content);
            $.Metro.initInputs();
            eventformschedule();
            $("#Schedule-BeginDatediv").datepicker({ position: "top", effect: "fade", format: "mm/dd/yyyy" });
            //$("#Schedule-EndDatediv").datepicker({ position: "top", effect: "fade", format: "mm/dd/yyyy" });
            //$('#signature').jSignature('getData');
            $("#Schedule-TimeEnd").clockpick({ minutedivisions: 12 });

            $("#Schedule-EmployeeID").change(function () {
                if ($(this).val() === 'Other') {
                    $("#Schedule-Employee-c").show();
                    $.Dialog.autoResize();
                }
                else {
                    $("#Schedule-Employee-c").hide();
                    $.Dialog.autoResize();
                }
            });

            $("#Schedule-Employee").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: clientIntakewebservice + '/GetSchedulingProviderBySearchTerm?$format=json',
                        dataType: "jsonp",
                        data: request,
                        success: function (data) {
                            var s = $.parseJSON(data);
                            return response($.parseJSON(data));
                        }
                    });
                },
                select: function (event, ui) {
                    // Prevent value from being put in the input:
                    this.value = ui.item.label;
                    // Set the next input's value to the "value" of the item.
                    var newOptionHtml = "<option value='" + ui.item.value + "'>" + ui.item.label + "</option>";
                    $("#Schedule-EmployeeID").append(newOptionHtml);
                    $("#Schedule-EmployeeID").val(ui.item.value);
                    $("#Schedule-Employee-c").hide();
                    $.Dialog.autoResize();
                    event.preventDefault();
                },
                appendTo: "#dialogInput",
                minLength: 2,
                open: function () {
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                },
                close: function () {
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                }
            });

        }


    });
}

function loadStafflog() {

    arrayStaffSchedule = [];

    getStaffScheduleSessions();
    //getScheduleActual();
}

function getStaffScheduleSessions() {
    var reqDate = $('#staff-session-datetxt').val();

    if (reqDate === '')
        reqDate = new Date();

    var srchRequest = JSON.stringify({ dateInitial: reqDate, dateFinal: reqDate, CPTCode: '', UserName: CISLogingName });
    console.log(srchRequest);
    $.ajax({
        dataType: "jsonp",
        url: clientIntakewebservice + '/GetStaffScheduling?callback=ProcessResponseStaffScheduleSessions&$format=json&sr=' + srchRequest,
        cache: false,
        jsonp: false,
        data: {},
        jsonpCallback: "ProcessResponseStaffScheduleSessions"
    });
}

function ProcessResponseStaffScheduleSessions(result) {
    var schedulesessiontable = $('#Intake-System-StaffSession-Log-Schedule').data('footable');
    var oldrow = $('#Intake-System-StaffSession-Log-Schedule' + '>tbody>tr');
    for (var r = 0; r < oldrow.length; r++) {
        schedulesessiontable.removeRow(oldrow[r]);
    }
    var scheduledsessions = $.parseJSON(result);
    var scheduledsessionshtml = "";
    $.each(scheduledsessions, function (i, s) {
        //if (s.Status === 0) {            

        var sd = new Date(parseInt(s.Started.substr(6)));
        var ed = new Date(parseInt(s.Ended.substr(6)));
        var clientUrl = '';
        if (s.ClientID != null) {
            clientUrl = "<a href='" + clientSiteUrl + s.ClientID + "' class='m-btn  blue' ><i class='icon-folder-close icon-white'></i> " + s.Client + "</a>";
        }

        scheduledsessionshtml = "<tr data-id='" + s.NPA_APPT_ID + "'><td>" + sd.format("mm/dd/yyyy") + "</td><td>" + sd.format("hh:MM TT") + "</td><td>" + ed.format("hh:MM TT") + "</td><td>" + s.CPTCode + "</td><td>" + clientUrl + "</td><td>" + (s.Status != null ? s.Status : "Not found")
            + "</td></tr>";
        schedulesessiontable.appendRow(scheduledsessionshtml);
        //}
        arrayStaffSchedule[s.NPA_APPT_ID] = s;
    });
}

function getStaffSchedulingByDate() {
    var reqDate = new Date();
    reqDate.setDate(reqDate.getDate() -1);

    var srchRequest = JSON.stringify({ dateInitial: reqDate, UserName: CISLogingName });
    //var srchRequest = JSON.stringify({ dateInitial: reqDate, dateFinal: reqDate, CPTCode: '', UserName: CISLogingName });
    console.log(srchRequest);
    $.ajax({
        dataType: "jsonp",
        url: clientIntakewebservice + '/GetStaffSchedulingByDate?callback=ProcessResponseStaffScheduleByDate&$format=json&sr=' + srchRequest,
        //url: clientIntakewebservice + '/GetStaffScheduling?callback=ProcessResponseStaffScheduleByDate&$format=json&sr=' + srchRequest,
        cache: false,
        jsonp: false,
        data: {},
        jsonpCallback: "ProcessResponseStaffScheduleByDate"
    });
}

function ProcessResponseStaffScheduleByDate(result) {
    var schedulesessiontable = $('#Intake-System-StaffSession-Log-Schedule-Signature-Timesheet').data('footable');
    var oldrow = $('#Intake-System-StaffSession-Log-Schedule-Timesheet' + '>tbody>tr');
    var totalHours = 0;
    var totalMinutes = 0;
                    
    for (var r = 0; r < oldrow.length; r++) {
        schedulesessiontable.removeRow(oldrow[r]);
    }
    var scheduledsessions = $.parseJSON(result);
    var scheduledsessionshtml = "";
    
    $.each(scheduledsessions, function (i, s) {
        //if (s.Status === 0) {            
        
        var sd = new Date(parseInt(s.Started.substr(6)));
        var ed = new Date(parseInt(s.Ended.substr(6)));
        var clientUrl = '';
        if (s.ClientID != null) {
            clientUrl = "<a href='" + clientSiteUrl + s.ClientID + "' class='m-btn  blue' ><i class='icon-folder-close icon-white'></i> " + s.Client + "</a>";
        }
        var minutes = s.ElapsedTime % 60;
        var hours = parseInt(s.ElapsedTime / 60);
        totalMinutes += s.ElapsedTime;
        if (minutes < 10) {
            minutes = '0' + minutes.toString();
        }
        scheduledsessionshtml += "<tr data-id='" + s.NPA_APPT_ID + "'><td>" + sd.format("mm/dd/yyyy") + "</td><td>" + sd.format("hh:MM TT") + "</td><td>" + ed.format("hh:MM TT") + "</td><td>" + s.CPTCode + "</td><td>" + clientUrl + "</td><td>" + hours + ':' + minutes + "</td></tr>";

        //}
        arrayStaffSchedule[s.NPA_APPT_ID] = s;
    });
    
    if (totalMinutes > 59) {
        totalHours += parseInt(totalMinutes/60);
        totalMinutes = totalMinutes % 60;
    }
    if(totalMinutes<10){
        totalMinutes = '0' + totalMinutes.toString();
    }
    
    $.Dialog({
        overlay: true,
        shadow: false,
        flat: true,
        draggable: true,
        title: 'Daily Signature',
        content: '',
        padding: 10,
        onShow: function (_dialog) {
            var height = 'auto';
            var content = '<form class="user-input">' +
            '<label>StaffName</label>' +
            '<label>Timesheet: ' + new Date().format("mm/dd/yyyy") + ' </label>' +
            '<div>' +
            '<table id="Intake-System-StaffSession-Log-Schedule-Signature-Timesheet" data-page-size="15" data-page-navigation=".paginationschedule" data-sort-initial="descending">' +
            '<thead>'+
            '<tr>'+
            '<th data-type="date" data-sort-initial="true">Date</th>' +
            '<th>Begins </th>'+
            '<th>Ends</th>'+
            '<th>Activity</th>' +
            '<th data-sort-ignore="true">Client</th>' +
            '<th>Elapsed Time</th>' +
            '</tr>'+
            '</thead>'+
            '<tbody>' + scheduledsessionshtml + '</tbody>' +
            '<tfoot class="hide-if-no-paging">'+
            '<tr>'+
            '<td colspan="9">'+
            '<div class="paginationschedule pagination pagination-centered"></div>'+
            '</td>'+
            '</tr>'+
            '</tfoot>'+
            '</table>'+
            '</div>' +
            '<div id="totalHours"><label>Total Hrs: '+totalHours+':'+totalMinutes+' </label></div>' +
            '<div id="totalHours"><label>Associate Signature <div id="signature"></div></label></div>' +
            '<button class="info" type="submit">Save</button>' +
            '<button class="danger" type="reset">Reset</button>' +
            '</form>';
            $.Dialog.content(content);
            $.Metro.initInputs();
            $('#Intake-System-StaffSession-Log-Schedule-Signature-Timesheet').footable();
            $("#signature").jSignature();
        }
    });
    
    
}

