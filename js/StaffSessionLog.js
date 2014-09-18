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
   
}

function loadStafflog() {
    arrayStaffSchedule = [];
    getStaffScheduleSessions();
}

function getStaffScheduleSessions() {
    var reqDate = $('#staff-session-datetxt').val();
    var srchRequest = JSON.stringify({ dateInitial: reqDate, dateFinal: reqDate, CPTCode: '', UserName: CISLogingName });
    if (reqDate === '') {
        reqDate = new Date();
    }
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
        var sd = new Date(parseInt(s.Started.substr(6)));
        var ed = new Date(parseInt(s.Ended.substr(6)));
        var clientUrl = '';
        if (s.ClientID != null) {
            clientUrl = "<a href='" + clientSiteUrl + s.ClientID + "' class='m-btn  blue' ><i class='icon-folder-close icon-white'></i> " + s.Client + "</a>";
        }
        scheduledsessionshtml = "<tr data-id='" + s.NPA_APPT_ID + "'><td>" + sd.format("mm/dd/yyyy") + "</td><td>" + sd.format("hh:MM TT") + "</td><td>" + ed.format("hh:MM TT") + "</td><td>" + s.CPTCode + "</td><td>" + clientUrl + "</td><td>" + (s.Status != null ? s.Status : "Not found")
            + "</td></tr>";
        schedulesessiontable.appendRow(scheduledsessionshtml);
        arrayStaffSchedule[s.NPA_APPT_ID] = s;
    });
}

function getStaffSchedulingByDate() {
    var reqDate = new Date();
    reqDate.setDate(reqDate.getDate() -1);
    var srchRequest = JSON.stringify({ dateInitial: reqDate, UserName: CISLogingName });
    console.log(srchRequest);
    $.ajax({
        dataType: "jsonp",
        url: clientIntakewebservice + '/GetStaffSchedulingByDate?callback=ProcessResponseStaffScheduleByDate&$format=json&sr=' + srchRequest,
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
    var scheduledsessions = $.parseJSON(result);
    var scheduledsessionshtml = "";
    var totalTime = 0;
    var isSignature = false;

    for (var r = 0; r < oldrow.length; r++) {
        schedulesessiontable.removeRow(oldrow[r]);
    }
    $.each(scheduledsessions, function (i, s) {
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
        arrayStaffSchedule[s.NPA_APPT_ID] = s;
    });
    totalTime = totalMinutes;
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
        width: 800,
        title: 'Staff Timesheet',
        content: '',
        padding: 10,
        position: 'auto',
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
            '<button id="saveTimeSheetSignature" class="info" type="submit">Save</button>' +
            '<button class="danger">Cancel</button>' +
            '</form>';
            $.Dialog.content(content);
            $.Metro.initInputs();
            $('#Intake-System-StaffSession-Log-Schedule-Signature-Timesheet').footable();
            $("#signature").jSignature();
            $('.danger').on('click', function () {
                $.Dialog.close();
            });
            $("#signature").bind('change', function (e) { isSignature = true;  });
            $('#saveTimeSheetSignature').on('click', function (e) {
                saveStaffScheduleSignature(e, totalTime, isSignature);
            });
            
        }
    });
    $.Dialog.autoResize();
}

function saveStaffScheduleSignature(e,totalTime, isSignature){
    e.preventDefault();
    try {
        if (!isSignature) throw 'Not signed'
        var signature = $("#signature").jSignature("getData");
        var srchRequest = JSON.stringify({ Signature: signature, MinutesSigned: totalTime, UserName: CISLogingName ,TimeSheetDate: new Date() });
        $.ajax({
            dataType: "jsonp",
            url: clientIntakewebservice + '/SaveStaffScheduleSignature?callback=CheckSaveStaffScheduleByDate&$format=json&sr=' + srchRequest,
            cache: false,
            jsonp: false,
            data: {},
            jsonpCallback: "CheckSaveStaffScheduleByDate"
        });
    } catch (e) {
        alert(e);
    }
    
}

function CheckSaveStaffScheduleByDate(result) {
    
    var message = $.parseJSON(result);
    try {
        if (message.result == false) throw "Error on save signature";
        $.Dialog.close();

    } catch (e) {
        alert(e)
    }
}
