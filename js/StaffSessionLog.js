var clientIntakewebservice =  "http://137.135.46.61/ClientIntake/esscDWHService.svc"; //"https://api.essocal.org/PracticeManagement/esscDWHService.svc";//"https://api.essocal.org/PracticeManagement/esscDWHService.svc";
var arrayStaffSchedule = [];
var arrayStatus = [];
var clientSiteUrl = "/Clients/";
var isStaffSessionLog = true;
var CISLogingName = "ricardo.esparza";


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
            checkSameDate();
            loadStafflog();
        }
    });
    $('#staff-session-endDate').datepicker({
        effect: "fade", format: "mm/dd/yyyy", selected: function (dateString, dateObject) {
            checkSameDate();
            loadStafflog();
        }
    });
    var date = new Date();
   
   
    $('#calendar').fullCalendar({
        header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
        },
        defaultDate: moment().toString(),
        defaultView: 'agendaDay',
        height: 500,
        eventClick: function (calEvent, jsEvent, view) {
            content = '';
            if (calEvent.type == "Non-Billable" || calEvent.type == "Billable")
            {
                content = '<label>Date</label>' +
                           '<label>' + moment(calEvent.start).format('L') + '</label>' +
                          // '<input type="hidden" id="Change-BeginDate"  disable="true" value="' + sd.format("mm/dd/yyyy") + '">' +
                           '<label>Scheduler Note</label>' +
                           '<div id="note" style = "min-height: 50px; margin: 2% 2%; padding: 1% 2%; background:#E0E0E0;">' +
                         //      '<label>' + arraySchedNotes[id] + '</label>' +
                           '</div>' +
                           '<label>Begin Time</label>' +
                           '<div class="input-control select" style="width:60px;margin-left: 10px;">' +
                               '<select id="Change-BeginDate-Hour">' + getTimevalues_Hour() + '</select>' +
                           '</div>' +
                           '<div class="input-control select" style="width:60px;margin-left: 10px;">' +
                               '<select id="Change-BeginDate-Min">' + getTimevalues_Min() + '</select>' +
                           '</div>' +
                           '<div class="input-control select" style="width:60px;margin-left: 10px;">' +
                               '<select id="Change-BeginDate-State">' +
                                   '<option value="AM">AM</option>' +
                                   '<option value="PM">PM</option>' +
                               '</select>' +
                           '</div>' +
                           '<label>End Time</label>' +
                           '<div class="input-control select" style="width:60px;margin-left: 10px;">' +
                               '<select id="Change-EndDate-Hour">' + getTimevalues_Hour() + '</select>' +
                           '</div>' +
                           '<div class="input-control select" style="width:60px;margin-left: 10px;">' +
                               '<select id="Change-EndDate-Min">' + getTimevalues_Min() + '</select>' +
                           '</div>' +
                           '<div class="input-control select" style="width:60px;margin-left: 10px;">' +
                               '<select id="Change-EndDate-State">' +
                                   '<option value="AM">AM</option>' +
                                   '<option value="PM">PM</option>' +
                               '</select>' +
                           '</div>' +
                           '<label>Notes</label>' +
                           '<div class="input-control text" style="width: 99%">' +
                               '<input type="text" name="Notes" id="NotesArea">' +
                                   '<button class="btn-clear"></button>' +
                           '</div>'+
                            '<div class="form-actions">' +
                            '<a id="saveButton" class="button primary" onclick="saveScheduleSession()">Save</a>&nbsp;' +
                            '<a class="button danger" type="button" onclick="$.Dialog.close()">Cancel</a> ' +
                            '</div>' ;
            } else {
                var clientUrl = ''
                if (calEvent.clientId != null && calEvent.clientId != 0) {
                    clientUrl = "<a href='" + clientSiteUrl + calEvent.clientId + "' class='m-btn button primary  blue' ><i class='icon-folder-close icon-white'></i> " + calEvent.clientName + "</a>";
                }
                content = '<div class = "grid">'+
                            '<label>Date</label>' +
                           '<label class="bg-cyan">' + moment(calEvent.start).format('L') + '</label>' +
                           '<label>Begin</label>' +
                           '<label class="bg-cyan">' + moment(calEvent.start).format("HH:mm a") + '</label>' +
                           '<label>Ends</label>' +
                           '<label class="bg-cyan">' + moment(calEvent.end).format("HH:mm a") + '</label>' +
                           '<label>Activity</label>' +
                           '<label class="bg-cyan">' + calEvent.cPTCode + '</label>' +
                           '<label>Client</label>' +
                           clientUrl +
                           '<label >Status</label>' +
                           '<label class="bg-cyan">' + calEvent.status + '</label></div>' +
                           '</br>'+
                            '<div class="form-actions">' +
                            '<a class="button danger" type="button" onclick="$.Dialog.close()">Cancel</a> ' +
                            '</div>';
            }
            displayDialog(calEvent.title, content);
            
            //alert('Event: ' + calEvent.type + ' '+ calEvent.cPTCode);
           // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
            //alert('View: ' + view.name);

            // change the border color just for fun
           // $(this).css('border-color', 'red');
        },
        //eventRender: function (event, element) {
            
        //}
    });

    $("#Intake-System-StaffSession-Daly-Signature").on('click', function () {
        getStaffSchedulingByDate();
    });
    
    //$(".fc-agendaWeek-button").click(function () { });
    $(".fc-prev-button").click(function (){
        getSchedulingRangeDate();
    });
    $(".fc-next-button").click(function (){
        getSchedulingRangeDate();
    });
    $(".fc-agendaDay-button").click(function (){
        getSchedulingRangeDate();
    });
    $(".fc-month-button").click(function(){
        getSchedulingRangeDate();
    });
    $(".fc-agendaWeek-button").click(function () {
        getSchedulingRangeDate();
    });
    /*var view = $('#calendar').fullCalendar('getView');
    if (view.name == 'agendaDay') {
        $("#Intake-System-StaffSession-Daly-Signature").show();
    } else {
        $("#Intake-System-StaffSession-Daly-Signature").hide();
    }*/

    
    
    loadStafflog();
   
}
function checkSameDate() {
    if ($('#staff-session-datetxt').val() != $('#staff-session-endDatetxt').val()) {
        $("#Intake-System-StaffSession-Daly-Signature").attr('disabled', 'disabled');
    } else {
        $("#Intake-System-StaffSession-Daly-Signature").removeAttr('disabled');
    }
}

function loadStafflog() {
    arrayStaffSchedule = [];
    getStaffScheduleSessions();
}

function getStaffScheduleSessions() {
    var reqDate = $('#staff-session-datetxt').val();
    var endDate = $('#staff-session-endDatetxt').val();
    if (reqDate === '') {
        reqDate = new Date();
    }
    if (endDate === '') {
        endDate = new Date();
    }
    var srchRequest = JSON.stringify({ dateInitial: reqDate, dateFinal: endDate, CPTCode: '', UserName: CISLogingName });
    $.ajax({
        dataType: 'jsonp',
        url: clientIntakewebservice + '/PGetStaffScheduling?callback=ProcessResponseStaffScheduleSessions&$format=json&sr=' + srchRequest,
        cache: false,
        jsonp: false,
        data: {},
        //username: 'Ricardo.Esparza',
        //password: 'Easter543',
        jsonpCallback: "ProcessResponseStaffScheduleSessions",
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(ajaxOptions);
            //alert(thrownError);
            var content = '';
            var title = '';
            if (xhr.status == 404) {
                title = '401 - Unauthorized: Access is denied due to invalid credentials.';
                content = '<div style ="width:410px">' +
                                    '<div class = "bg-white">'+
                                        '<p  class="text-alert">You do not have permission to view this directory or page using ' +
                                        'the credentials that you supplied.</p>' +
                                        '<ul>' +
                                          '<li>Incorrect username o password</li>' +
                                          '<li>You do not have access to the service</li>' +
                                          //'<li>Milk</li>'+
                                        '</ul>' +
                                        '</br>' +
                                        '</br>' +
                                    '</div>'+
                                    '<button onclick="$.Dialog.close()">Close</button>' +
                                '</div>';
            }
            $.Dialog({
                overlay: true,
                shadow: false,
                flat: true,
                draggable: true,
                width: 400,
                title: title,
                content: content,
                padding: 10,
                position: 'auto',
                onShow: function (_dialog) {
                    $.Metro.initInputs();
                    $.Dialog.autoResize();
                }
            });
        }
    });
}

function ProcessResponseStaffScheduleSessions(result) {
    $("#calendar").fullCalendar('removeEvents');
    /*var schedulesessiontable = $('#Intake-System-StaffSession-Log-Schedule').data('footable');
    var oldrow = $('#Intake-System-StaffSession-Log-Schedule' + '>tbody>tr');
    for (var r = 0; r < oldrow.length; r++) {
        schedulesessiontable.removeRow(oldrow[r]);
    }
    
    //var scheduledsessionshtml = "";
    //var eventObject = new Object();*/
    var scheduledsessions = $.parseJSON(result);
    var arrayEvents = [];
    $.each(scheduledsessions, function (i, s) {
        var color = '#52b9e9';
        
        //var sd = new Date(parseInt(s.Started.substr(6)));
        //var ed = new Date(parseInt(s.Ended.substr(6)));
        
        var clientUrl = '';
        var clientName = '';
        if (s.ClientID != null && s.ClientID != 0) {
            clientUrl = "<a href='" + clientSiteUrl + s.ClientID + "' class='m-btn  blue' ><i class='icon-folder-close icon-white'></i> " + s.Client + "</a>";
            clientName = " Client: "+ s.Client;
        }
        //scheduledsessionshtml = "<tr data-id='" + s.NPA_APPT_ID + "'><td>" + sd.format("mm/dd/yyyy") + "</td><td>" + sd.format("hh:MM TT") + "</td><td>" + ed.format("hh:MM TT") + "</td><td>" + s.CPTCode + "</td><td>" + clientUrl + "</td><td>" + (s.Status != null ? s.Status : "Not found")
         //   + "</td></tr>";
        //schedulesessiontable.appendRow(scheduledsessionshtml);
        //arrayStaffSchedule[s.NPA_APPT_ID] = s;
        if (s.Type == "Non-Billable" || s.Type == "Billable")
        {
            color = 'red';
        }
        var event = {
            id: s.NPA_APPT_ID,
            title: "Activity: " + s.CPTCode + " Status: " + s.Status + clientName,
            cPTCode: s.CPTCode,
            type: s.Type,
            status: s.Status,
            clientName: s.Client,
            clientId: s.ClientID,
            start: moment(s.Started),
            end: moment(s.Ended),
            color: color,
            description: 'prueba de texto',
            textColor:'#000'
        };
        arrayEvents.push(event);
        
        $('#calendar').fullCalendar('renderEvent', event);
       
    });
    $('#calendar').fullCalendar({
        eventClick: function (calEvent, jsEvent, view) {

            alert('Event: ' + calEvent.title);
            alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
            alert('View: ' + view.name);

            // change the border color just for fun
            $(this).css('border-color', 'red');

        }
    });
    /*$('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,basicDay'
        },
        defaultDate: moment().toString(),
        defaultView: 'agendaDay',
        height:500,
        event: arrayEvents

    });*/
}

function getStaffSchedulingByDate() {
    var reqDate = new Date();
    //reqDate.setDate(reqDate.getDate() -2); //to get  17/09/2014
    var srchRequest = JSON.stringify({ dateInitial: reqDate, UserName: CISLogingName });
    $.ajax({
        dataType: "jsonp",
        url: clientIntakewebservice + '/PGetStaffSchedulingByDate?callback=ProcessResponseStaffScheduleByDate&$format=json&sr=' + srchRequest,
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
    var isSigned = false;
    var scheduledsessions = $.parseJSON(result).SessionLogs;
    var timesheet = $.parseJSON(result).Timesheets;
    var scheduledsessionshtml = "";
    var totalTime = 0;
    var isSignature = false;
    var signature = "";

    for (var r = 0; r < oldrow.length; r++) {
        schedulesessiontable.removeRow(oldrow[r]);
    }
    if(timesheet != null && timesheet != "")
    {
        isSigned = true;
    }
    $.each(timesheet, function (i, s) {
        signature = s.Signature;
    });
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
            '<div><label>Associate Signature <div id="signature"></div></label></div>' +
            '<button id="saveTimeSheetSignature" class="info" type="submit">Save</button>' +
            '<button class="danger">Cancel</button>' +
            '</form>';
            $.Dialog.content(content);
            $.Metro.initInputs();
            $('#Intake-System-StaffSession-Log-Schedule-Signature-Timesheet').footable();
            
            if (isSigned) {
                var htmlsign = '<div id="signatureparent"><img src="' + signature.replace(/ /g, "+") + '" alt="Signed"></div>';
                $("#signature").replaceWith(htmlsign);
                $('#saveTimeSheetSignature').attr('disabled', 'disabled');
            } else {
                $("#signature").jSignature();
            }
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
        var timeSheetDate = new Date();
        //timeSheetDate.setDate(timeSheetDate.getDate() - 2); //to get 17/09/2014
        var signature = $("#signature").jSignature("getData");
        var srchRequest = JSON.stringify({ Signature: signature, MinutesSigned: totalTime, UserName: CISLogingName, TimeSheetDate: timeSheetDate  });
        $.ajax({
            dataType: "jsonp",
            url: clientIntakewebservice + '/PSaveStaffScheduleSignature?callback=CheckSaveStaffScheduleByDate&$format=json&sr=' + srchRequest,
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
function getRangeDate() {
    var view = $('#calendar').fullCalendar('getView');
    console.log(view.name);
    console.log('Start : ' + moment(view.start).format());
    console.log('End : ' + moment(view.end).format());
    console.log('interval Start : ' + moment(view.intervalStart).format());
    console.log('interval end : ' + moment(view.intervalEnd).format());
}

function getSchedulingRangeDate() {
    var view = $('#calendar').fullCalendar('getView');
    if (view.name == 'agendaDay') {
        $("#Intake-System-StaffSession-Daly-Signature").show();
    } else {
        $("#Intake-System-StaffSession-Daly-Signature").hide();
    }
    var srchRequest = JSON.stringify({ dateInitial: view.intervalStart, dateFinal: view.intervalEnd, CPTCode: '', UserName: CISLogingName });
    $.ajax({
        dataType: 'jsonp',
        url: clientIntakewebservice + '/PGetStaffScheduling?callback=ProcessResponseStaffScheduleSessions&$format=json&sr=' + srchRequest,
        cache: false,
        jsonp: false,
        data: {},
        //username: 'Ricardo.Esparza',
        //password: 'Easter543',
        jsonpCallback: "ProcessResponseStaffScheduleSessions",
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(ajaxOptions);
            //alert(thrownError);
            var content = '';
            var title = '';
            if (xhr.status == 404) {
                title = '401 - Unauthorized: Access is denied due to invalid credentials.';
                content = '<div style ="width:410px">' +
                                    '<div class = "bg-white">' +
                                        '<p  class="text-alert">You do not have permission to view this directory or page using ' +
                                        'the credentials that you supplied.</p>' +
                                        '<ul>' +
                                          '<li>Incorrect username o password</li>' +
                                          '<li>You do not have access to the service</li>' +
                                          //'<li>Milk</li>'+
                                        '</ul>' +
                                        '</br>' +
                                        '</br>' +
                                    '</div>' +
                                    '<button onclick="$.Dialog.close()">Close</button>' +
                                '</div>';
            }
            $.Dialog({
                overlay: true,
                shadow: false,
                flat: true,
                draggable: true,
                width: 400,
                title: title,
                content: content,
                padding: 10,
                position: 'auto',
                onShow: function (_dialog) {
                    $.Metro.initInputs();
                    $.Dialog.autoResize();
                }
            });
        }
    });
}


function getTimevalues_Hour() {
    var time = '';
    time += '<option value="12">12</option>';
    time += '<option value="01">01</option>';
    time += '<option value="02">02</option>';
    time += '<option value="03">03</option>';
    time += '<option value="04">04</option>';
    time += '<option value="05">05</option>';
    time += '<option value="06">06</option>';
    time += '<option value="07">07</option>';
    time += '<option value="08">08</option>';
    time += '<option value="09">09</option>';
    time += '<option value="10">10</option>';
    time += '<option value="11">11</option>';
    time += '<option value="12">12</option>';
    return time;
}

function getTimevalues_Min() {
    var time = '';
    time += '<option value="00">00</option>';
    time += '<option value="01">01</option>';
    time += '<option value="02">02</option>';
    time += '<option value="03">03</option>';
    time += '<option value="04">04</option>';
    time += '<option value="05">05</option>';
    time += '<option value="06">06</option>';
    time += '<option value="07">07</option>';
    time += '<option value="08">08</option>';
    time += '<option value="09">09</option>';
    time += '<option value="10">10</option>';
    time += '<option value="11">11</option>';
    time += '<option value="12">12</option>';
    time += '<option value="13">13</option>';
    time += '<option value="14">14</option>';
    time += '<option value="15">15</option>';
    time += '<option value="16">16</option>';
    time += '<option value="17">17</option>';
    time += '<option value="18">18</option>';
    time += '<option value="19">19</option>';
    time += '<option value="20">20</option>';
    time += '<option value="21">21</option>';
    time += '<option value="22">22</option>';
    time += '<option value="23">23</option>';
    time += '<option value="24">24</option>';
    time += '<option value="25">25</option>';
    time += '<option value="26">26</option>';
    time += '<option value="27">27</option>';
    time += '<option value="28">28</option>';
    time += '<option value="29">29</option>';
    time += '<option value="30">30</option>';
    time += '<option value="31">31</option>';
    time += '<option value="32">32</option>';
    time += '<option value="33">33</option>';
    time += '<option value="34">34</option>';
    time += '<option value="35">35</option>';
    time += '<option value="36">36</option>';
    time += '<option value="37">37</option>';
    time += '<option value="38">38</option>';
    time += '<option value="39">39</option>';
    time += '<option value="40">40</option>';
    time += '<option value="41">41</option>';
    time += '<option value="42">42</option>';
    time += '<option value="43">43</option>';
    time += '<option value="44">44</option>';
    time += '<option value="45">45</option>';
    time += '<option value="46">46</option>';
    time += '<option value="47">47</option>';
    time += '<option value="48">48</option>';
    time += '<option value="49">49</option>';
    time += '<option value="50">50</option>';
    time += '<option value="51">51</option>';
    time += '<option value="52">52</option>';
    time += '<option value="53">53</option>';
    time += '<option value="54">54</option>';
    time += '<option value="55">55</option>';
    time += '<option value="56">56</option>';
    time += '<option value="57">57</option>';
    time += '<option value="58">58</option>';
    time += '<option value="59">59</option>';
    return time;
}
function displayDialog(title, content) {
    $.Dialog({
        overlay: true,
        shadow: false,
        flat: true,
        draggable: true,
        width: 400,
        title: title,
        content: content,
        padding: 10,
        position: 'auto',
        onShow: function (_dialog) {
            $.Metro.initInputs();
            $.Dialog.autoResize();
        }
    });
}