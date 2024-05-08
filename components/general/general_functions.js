/**
 * Created by Shaiful Islam on 2023-08-02.
 */
// ---------------
/* global basic_info */
/* global ipcRenderer */
/* global secondsToDhms */

let motorIdForDetailsView=0;
let machine_mode=0;

/*Labels*/
function setActiveAlarmSettings(){
    let hmiSettings= basic_info['hmiSettings']
    if(hmiSettings['alarm_show_details'] ==1){
        $('#table_active_alarms').show()
        $('#container_ticker_active_alarms').hide()
    }
    else{
        $('#table_active_alarms').hide()
        $('#container_ticker_active_alarms').show()
    }
}
function setConveyorsLabel(){
    let conveyors=basic_info['conveyors'];
    if(conveyors!=undefined){
        Object.values(conveyors).forEach(record => {
            if(record['gui_id']){
                $('.conveyor[gui_id="'+record['gui_id']+'"]').attr('conveyor_id',record['conveyor_id']).attr('data-original-title',record['conveyor_name']).show();
            }
        })
    }
}
function setInputsLabel(){
    let inputs=basic_info['inputs']
    if(inputs!=undefined){
        Object.values(inputs).forEach(record => {
            //if(record['gui_id']>0 && (record['input_type']==0)&& (record['device_type']==0)&& (record['device_number']==0) ){
            if(record['gui_id']){
                if(record['input_type']==0){
                    $('.photoeye[gui_id="'+record['gui_id']+'"]').attr('input_id',record['input_id']).attr('data-original-title',record['electrical_name']+'<br>'+record['description']).show();
                    $('.proximity[gui_id="'+record['gui_id']+'"]').attr('input_id',record['input_id']).attr('data-original-title',record['electrical_name']+'<br>'+record['description']).show();
                }
                else if(record['input_type']==3){
                    $('.estop[gui_id="'+record['gui_id']+'"]').attr('input_id',record['input_id']).attr('data-original-title',record['electrical_name']+'<br>'+record['description']).show();
                }
                else if(record['input_type']==1){
                    $('.proximity[gui_id="'+record['gui_id']+'"]').attr('input_id',record['input_id']).attr('data-original-title',record['electrical_name']+'<br>'+record['description']).show();
                }
            }
        })
    }
}
function setDevicesLabel(){
    let devices=basic_info['devices'];
    for(let key in devices){
        let device=devices[key];
        if(device['gui_id'] ){
            $('.device[gui_id="'+device["gui_id"]+'"]').attr('device_id',device["device_id"]).attr('data-original-title',device['device_name']+'<br>'+device['ip_address']).show();
        }
    }
}
function setMotorsLabel(){
    for(let key in basic_info['motors']){
        let motor=basic_info['motors'][key];
        if(motor['gui_id']){
            $('.motor[gui_id="'+motor["gui_id"]+'"]').attr('motor_id',motor["motor_id"]).attr('clickable',motor["clickable"]).attr('data-original-title',motor['motor_name']+'<br>'+motor['ip_address']+'<br>Loc: '+motor['location']).show();
        }
    }
    if(basic_info['hmiSettings']['motor_speed_unit']=='ft_min'){
        $('#motor-details #label_speed_input_unit').html('ft/min')
    }
    else{
        $('#motor-details #label_speed_input_unit').html('m/s')
    }
}
function setMotorDetailsView(){
    if(machine_mode!=1){
        $('#motor-details #tr_speed').hide();
        $('#motor-details #command_buttons_container').hide();
        $('#motor-details').css('height','115px');
    }
    else{
        $('#motor-details #tr_speed').show();
        $('#motor-details #command_buttons_container').show();
        $('#motor-details').css('height','225px');
    }
}
function setButtonsToggleStatus(){
    console.log(basic_info['hmiSettings'])
    if(basic_info['hmiSettings']['btn_toggle_bg']=='0'){
        $('#btn_toggle_bg').trigger('click');
    }
    if(basic_info['hmiSettings']['btn_toggle_conveyors']=='0'){
        $('#btn_toggle_conveyors').trigger('click');
    }
    if(basic_info['hmiSettings']['btn_toggle_devices']=='0'){
        $('#btn_toggle_devices').trigger('click');
    }
    if(basic_info['hmiSettings']['btn_toggle_estop']=='0'){
        $('#btn_toggle_estop').trigger('click');
    }
    if(basic_info['hmiSettings']['btn_toggle_photoeyes']=='0'){
        $('#btn_toggle_photoeyes').trigger('click');
    }
    if(basic_info['hmiSettings']['btn_toggle_proximity']=='0'){
        $('#btn_toggle_proximity').trigger('click');
    }
    if(basic_info['hmiSettings']['btn_toggle_motors']=='0'){
        $('#btn_toggle_motors').trigger('click');
    }
}
function changeToggleButtonState(button_id,elements,setting_var){
    let state=$(button_id).attr('data-state');
    if(state==1){
        $(button_id).attr('data-state',0).css('background-color',"#6c757d");
        elements.hide();
        ipcRenderer.send("sendRequestToIpcMain", "saveSettings",{[setting_var]:0});
    }
    else{
        $(button_id).attr('data-state',1).css('background-color',"");
        elements.show();
        ipcRenderer.send("sendRequestToIpcMain", "saveSettings",{[setting_var]:1});
    }
}
$(document).on('click','#btn_toggle_bg',function (event){
    changeToggleButtonState('#btn_toggle_bg',$('#bg_image'),'btn_toggle_bg');
})
$(document).on('click','#btn_toggle_conveyors',function (event){
    changeToggleButtonState('#btn_toggle_conveyors',$('.conveyor').not('[conveyor_id=0]'),'btn_toggle_conveyors');
})
$(document).on('click','#btn_toggle_devices',function (event){
    changeToggleButtonState('#btn_toggle_devices',$('.device').not('[device_id=0]'),'btn_toggle_devices');
})
$(document).on('click','#btn_toggle_estop',function (event){
    changeToggleButtonState('#btn_toggle_estop',$('.estop').not('[input_id=0]'),'btn_toggle_estop')
})
$(document).on('click','#btn_toggle_photoeyes',function (event){
    changeToggleButtonState('#btn_toggle_photoeyes',$('.photoeye').not('[input_id=0]'),'btn_toggle_photoeyes')
})
$(document).on('click','#btn_toggle_proximity',function (event){
    changeToggleButtonState('#btn_toggle_proximity',$('.proximity').not('[input_id=0]'),'btn_toggle_proximity')
})
$(document).on('click','#btn_toggle_motors',function (event){
    changeToggleButtonState('#btn_toggle_motors',$('.motor').not('[motor_id=0]'),'btn_toggle_motors')
})
$(document).on('click','#btn_toggle_legend',function (event){
    //window.open('components/general/general_colors.svg', '_blank', 'top=0,left=0')
    ipcRenderer.send("sendRequestToIpcMain", "showChildWindow",{'name':'legend'});
})
$(document).on('click','.conveyor[motor_zone]',function (event){
    let motor_zone=$(this).attr('motor_zone');
    $('#motor_zone_'+motor_zone).show();
})
$(document).on('click','.motor_zone_close',function (event){
    $('.motor_zone').hide();
})
$(document).on('click','#motor-details #close',function (event){
    $('#motor-details').hide();
})
$(document).on('click','.motor[clickable="1"]',function (event){
    let motors=basic_info['motors']
    let motor_id=$(this).attr('motor_id');
    motorIdForDetailsView=motor_id;
    setMotorDetailsView();
    $('#motor-details #speed_error').hide();
    $('#motor-details #motor_name').html(motors[basic_info['selectedMachineId']+'_'+motor_id]['motor_name'])
    $('#motor-details #location').html(motors[basic_info['selectedMachineId']+'_'+motor_id]['location'])
    $('#motor-details #ip_address').html(motors[basic_info['selectedMachineId']+'_'+motor_id]['ip_address'])
    $('#motor-details #current_speed').html('-')
    $('#motor-details').show();
})
$(document).on('click','#motor-details  #button-motor-start',function (event){
    if(machine_mode==1){
        let machine_id=basic_info['selectedMachineId'];
        let motorInfo=basic_info['motors'][machine_id+'_'+motorIdForDetailsView];
        let speed;
        let speed_min;
        let speed_max;
        if(basic_info['hmiSettings']['motor_speed_unit']=='ft_min'){
            speed=$('#motor-details #speed').val()*5.08;
            speed_min=motorInfo['speed_min']/5.08;
            speed_max=motorInfo['speed_max']/5.08;
        }
        else{
            speed=$('#motor-details #speed').val()*1000;
            speed_min=motorInfo['speed_min']/1000;
            speed_max=motorInfo['speed_max']/1000;
        }
        speed=parseInt(speed);

        if(speed<motorInfo['speed_min'] || speed>motorInfo['speed_max']){
            $('#motor-details #speed_max').text(speed_max.toFixed(2))
            $('#motor-details #speed_min').text(speed_min.toFixed(2))
            $('#motor-details #speed_error').show();
        }
        else{
            $('#motor-details #speed_error').hide();
            let params={
                'message_id':123,
                'device_id':(+motorIdForDetailsView + 100),
                'command':1,
                'parameter1':speed
            };
            ipcRenderer.send("sendRequestToServer", "forwardSMMessage",params,[]);
        }
    }
})
$(document).on('click','#motor-details  #button-motor-stop',function (event){
    if(machine_mode==1) {
        let params={
            'message_id':123,
            'device_id':(+motorIdForDetailsView + 100),
            'command':0,
            'parameter1':0
        };
        ipcRenderer.send("sendRequestToServer", "forwardSMMessage",params,[]);
    }
})
/*States*/

let ticker_active_alarms = $('#ticker_active_alarms').newsTicker({
    row_height: 100,
    max_rows: 2,
    duration: 4000,
    pauseOnHover: 0
});
let ticker_data_current = []
function setActiveAlarms(active_alarms){
    let alarms=basic_info['alarms']
    let machine_id=basic_info['selectedMachineId'];
    let now_timestamp=moment().unix();
    let alarm_class_names = {"0" : "Error", "1" : "Warning", "2" : "Message"};
    $("#table_active_alarms tbody").empty();
    let tickers_data_new = [];
    if(active_alarms.length>0){
        for(let i=0;(i<active_alarms.length && i<5);i++){
            let key=machine_id+'_'+active_alarms[i]['alarm_id']+'_'+active_alarms[i]['alarm_type'];
            if(alarms[key]!=undefined) {
                let html = '<tr>' +
                    '<td>' + moment.unix(active_alarms[i]['date_active_timestamp']).format("MMM D Y, H:mm:ss") + '</td>' +
                    '<td>' + secondsToDhms(now_timestamp-active_alarms[i]['date_active_timestamp']) + '</td>' +
                    '<td>' + alarm_class_names[alarms[key]['alarm_class']] + '</td>' +
                    '<td>' + alarms[key]['location'] + '</td>' +
                    '<td>' + alarms[key]['description'] + '</td>' +
                    '<td>' + alarms[key]['variable_name'] + '</td>' +
                    '</tr>';
                $("#table_active_alarms tbody").append(html);
                tickers_data_new.push(alarms[key]['description']);
            }
        }
    }
    let ticker_data_count = tickers_data_new.length;
    if(ticker_data_count>0){
        if(tickers_data_new.sort().join(',') !== ticker_data_current.sort().join(',')){
            $('#ticker_active_alarms').empty();
            ticker_active_alarms.newsTicker('pause');
            ticker_data_current=tickers_data_new;
            if(ticker_data_count == 1){
                let html = '<li class="ticker-single-item">' + ticker_data_current[0] + '</li>';
                $("#ticker_active_alarms").append(html);
            }
            else {
                ticker_data_current.forEach(elem => {
                    let html = '<li>' + elem + '</li>';
                    $("#ticker_active_alarms").append(html);
                });
                if(ticker_data_count>2){
                    ticker_active_alarms.newsTicker('unpause');
                }
            }
        }
    }
    else{
        ticker_data_current=[]
        $('#ticker_active_alarms').empty();
        ticker_active_alarms.newsTicker('pause');

        let html = '<tr><td colspan="6">No active alarm to display</td></tr>';
        $("#table_active_alarms tbody").append(html);
    }
}
function setConveyorsStates(conveyor_states){
    let conveyor_colors = { "0" : "#ccc",  "1" : "#27e22b", "2" : "#ffc000", "3" : "red","4":"#87cefa"};
    for(let key in conveyor_states){
        $('.conveyor[conveyor_id='+conveyor_states[key]['conveyor_id']+']').css('stroke',conveyor_colors[conveyor_states[key]['state']]);
    }
}
function setInputsStates(input_states){
    let photoeye_colors = {"in-active" : "#39b54a", "active" : "#f7931e"};
    let estop_colors = {"in-active" : "#39b54a", "active" : "#ff0000"};
    let proximity_colors = {"in-active" : "#39b54a", "active" : "#f7931e"};
    for(let key in basic_info['inputs']){
        let input=basic_info['inputs'][key];
        let state='in-active';
        if(input_states[key]){
            if(input['active_state']==input_states[key]['state']){
                state='active'
            }
        }
        if(input['gui_id']){
            if(input['input_type']==0){
                $('.photoeye[input_id='+input["input_id"]+']').css('fill',photoeye_colors[state]);
                $('.proximity[input_id='+input["input_id"]+']').css('fill',proximity_colors[state]);
            }
            else if(input['input_type']==3){
                $('.estop[input_id='+input["input_id"]+']').css('fill',estop_colors[state]);
            }
            else if(input['input_type']==1){
                $('.proximity[input_id='+input["input_id"]+']').css('fill',proximity_colors[state]);
            }
        }
    }
}
function setDevicesStates(device_states){
    let device_colors = {"0" : "#f00", "1" : "#27e22b"};
    for(let key in basic_info['devices']){
        let device=basic_info['devices'][key];
        if(device['gui_id']){
            let state=0;
            if(device_states[key]!=undefined){
                state=device_states[key]['state'];
            }
            $('.device[device_id='+device["device_id"]+']').css('fill',device_colors[state]);
        }
    }
}
function setMotorsStates(data){
    if(data['machine_mode']!=machine_mode){
        machine_mode=data['machine_mode'];
        setMotorDetailsView();
    }
    let machine_id=basic_info['selectedMachineId'];
    let motors=basic_info['motors']
    let inputs=basic_info['inputs'];

    let inputs_states=data['inputs_states']
    let devices_states=data['devices_states']
    let motors_current_speed=data['motors_current_speed']
    let alarms_active_states={};
    for(let i in data['alarms_active']){
        let alarm_active=data['alarms_active'][i];
        alarms_active_states[machine_id+'_'+alarm_active['alarm_id']+'_'+alarm_active['alarm_type']]=1;
    }
    for(let key in motors) {
        let motor = motors[key]
        let cnx_status = '#fff';
        let faulted_status = '#fff';
        let status = '#e6e6e6';
        if(motor['input_id']>0){
            if(inputs[machine_id+'_'+motor['input_id']] !=undefined){
                if((inputs_states[machine_id+'_'+motor['input_id']]['state'])==inputs[machine_id+'_'+motor['input_id']]['active_state']){
                    status='#27e22b';
                    faulted_status='#27e22b';
                }
            }
        }
        if(motor['alarm_ids']){
            let alarm_ids=motor['alarm_ids'].split(",");
            for (let i=0;i<alarm_ids.length;i++){
                if((alarm_ids[i]>0 ) && (alarms_active_states[machine_id+'_'+alarm_ids[i]+'_0'] !=undefined)){//motor['alarm_type']  here is 0
                    status='#f00';
                    faulted_status='#f00';
                    break;
                }
            }
        }
        if(motor['device_number']>0){
            if(devices_states[machine_id+'_'+motor['device_number']] !=undefined){
                if(devices_states[[machine_id+'_'+motor['device_number']]]['state']==1){
                    cnx_status='#27e22b';//connected
                }
                else{
                    cnx_status='#f00';
                    status='#f00';
                }
            }
        }
        $('.motor[motor_id='+motor["motor_id"]+']').css('fill',status);
        if(motorIdForDetailsView==motor["motor_id"]){
            if(basic_info['hmiSettings']['motor_speed_unit']=='ft_min'){
                $('#motor-details #current_speed').html((motors_current_speed[machine_id+'_'+motorIdForDetailsView]/5.08).toFixed(2)+ ' ft/min')
            }
            else{
                $('#motor-details #current_speed').html(motors_current_speed[machine_id+'_'+motorIdForDetailsView]/1000+ ' m/s')
            }
            $('#motor-details #cnx_status').css('fill',cnx_status);
            $('#motor-details #faulted_status').css('fill',faulted_status);
        }
    }
}











$('#switch_legend_production').change(function () {
    if ($(this).is(":checked")) {
        $('#svg_general_colors').hide();
        $('#container_production').show();
        ipcRenderer.send("sendRequestToIpcMain", "saveSettings",{'general_show_production':1});
    } else {
        $('#svg_general_colors').show();
        $('#container_production').hide();
        ipcRenderer.send("sendRequestToIpcMain", "saveSettings",{'general_show_production':0});
    }
});
$('.bin.cursor-pointer').on('click',function (){
    let bin_id=$(this).attr('bin-id');
    if(basic_info['bins'][basic_info['selectedMachineId']+'_'+bin_id] !=undefined){
        basic_info['pageParams']={'bin':basic_info['bins'][basic_info['selectedMachineId']+'_'+bin_id]}
        ipcRenderer.send("sendRequestToIpcMain", "changeMenu",
            {
                'currentMenu':{'file':'general_bin_details',
                'title':'Bins Detail: '+basic_info['pageParams']['bin']['bin_label'],
                'name':'general_bin_details','members':'general'},
                'pageParams':basic_info['pageParams']
            });
    }


})

function setBinsLabel(){
    let bins=basic_info['bins']
    let layoutNo=basic_info['hmiSettings']['general_layout_no']
    if(bins!=undefined){
        let num_bins=Math.max(...Object.values(bins).map(bin => bin['gui_id']!='999'?bin['gui_id']:0), 0);
        let bin_width=0;
        if(num_bins>0){
            if(layoutNo=="5"){
                bin_width=Math.trunc(1120/Math.ceil(num_bins/2))
            }
            else{
                bin_width=Math.trunc(1500/Math.ceil(num_bins/2))
            }
        }
        for(let key in bins){
            if(bins[key]['gui_id']>0){
                if(bins[key]['gui_id']!="999"){
                    let binIndex=(Math.ceil(bins[key]['gui_id']/2));
                    let posRect=0;
                    let posText=0;
                    if((layoutNo=="1")||(layoutNo=="3"))
                    {
                        posRect=201-1+(binIndex-1)*bin_width;
                    }
                    else if(layoutNo==5){
                        posRect=1280-(binIndex)*bin_width;
                    }
                    else {
                        posRect=1650-(binIndex)*bin_width;
                    }
                    posText=posRect-20+(bin_width/2);
                    $('.bin[gui-bin-id='+bins[key]['gui_id']+'] rect').attr('width',bin_width-10).attr('x',posRect)
                    $('.bin[gui-bin-id='+bins[key]['gui_id']+'] text').attr('x',posText);
                }
                $('.bin[gui-bin-id='+bins[key]['gui_id']+'] .bin-label').text(bins[key]['bin_label']);
                $('.bin[gui-bin-id='+bins[key]['gui_id']+']').attr('bin-id',bins[key]['bin_id']).show();
            }
        }

    }
}



function setTestButtonsStatus(outputStates){
    let machine_id=basic_info['selectedMachineId'];
    if(outputStates[machine_id+"_49"] && outputStates[machine_id+"_49"]['state']==1){
        $("#btn-test-red-light").attr('data-started',1).css('background-color',$("#btn-test-red-light").attr('data-started-color'));
    }
    if(outputStates[machine_id+"_50"] && outputStates[machine_id+"_50"]['state']==1){
        $("#btn-test-amber-light").attr('data-started',1).css('background-color',$("#btn-test-amber-light").attr('data-started-color'));
    }
    if(outputStates[machine_id+"_51"] && outputStates[machine_id+"_51"]['state']==1){
        $("#btn-test-blue-light").attr('data-started',1).css('background-color',$("#btn-test-blue-light").attr('data-started-color'));
    }
}

function setBinsStates(bin_states){
    let bin_state_colors=basic_info['bin_state_colors'];
    for(let bin_key in bin_states){
        let bin_color='#27e22b';
        for(let i=0;i<bin_state_colors.length;i++)
        {
            let bin_state_color=bin_state_colors[i];
            if(bin_states[bin_key][bin_state_color['name']]==1){
                bin_color=bin_state_color['color_active'];
                break;
            }
        }
        $('.bin[bin-id='+bin_states[bin_key]['bin_id']+'] rect').css('fill',bin_color);
    }
}


function setDoorsStates(input_states){
    let machine_id=basic_info['selectedMachineId'];
    $('.door').hide();//hide all buttons
    let doors=basic_info['doors']
    for(let door_no in doors){
        let door=doors[door_no];
        let door_closed='in-active';
        let door_locked='in-active';
        let door_safe='in-active';
        if(door[1] !=undefined){
            if(input_states[machine_id+'_'+door[1]['input_id']] !=undefined){
                if(input_states[machine_id+'_'+door[1]['input_id']]['state']==door[1]['active_state']){
                    door_closed='active';
                }
            }
        }
        if(door[2]){
            if(input_states[machine_id+'_'+door[2]['input_id']]){
                if(input_states[machine_id+'_'+door[2]['input_id']]['state']==door[2]['active_state']){
                    door_locked='active';
                }
            }
        }
        if(door[3]){
            if(input_states[machine_id+'_'+door[3]['input_id']]){
                if(input_states[machine_id+'_'+door[3]['input_id']]['state']==door[3]['active_state']){
                    door_safe='active';
                }
            }
        }
        if(door_closed=='active'){
            if((door_locked=='in-active')&&(door_safe=='in-active')){
                $('.door-lock[data-device-id='+(+door_no+90)+']').show();
            }
            else{
                $('.door-unlock[data-device-id='+(+door_no+90)+']').show();
            }
        }
        else{
            $('.door-open[data-device-id='+(+door_no+90)+']').show();
        }

    }
}
function setEstopsStates(input_states){
    let input_colors = {"in-active" : "#00ff00", "active" : "#ff0000"};
    for(let key in basic_info['inputs']){
        let input=basic_info['inputs'][key];
        if((input['input_type']==3) && input['gui_id']>0 &&  (input['device_type']==0) && (input['device_number']==0) ){
            let state='in-active'
            if(input_states[key] !=undefined){
                if(input['active_state']==input_states[key]['state']){
                    state='active'
                }
            }
            $('.estop[input-id='+input["input_id"]+'] .status').css('fill',input_colors[state]);

        }
    }
}


function setStatisticsCounter(statistics_counter){
    if(statistics_counter.length>0){
        let shiftInfo=statistics_counter[0];
        let machine_errors = 0, non_machine_errors = 0
        Object.keys(shiftInfo).forEach(s_key => {
            if (['sc1', 'sc3', 'sc4', 'sc6', 'sc9', 'sc14', 'sc16', 'sc17', 'sc21'].includes(s_key)) {
                machine_errors += Number(shiftInfo[s_key]);
            }
            if (['sc5', 'sc7', 'sc8', 'sc10', 'sc12', 'sc18'].includes(s_key)) {
                non_machine_errors += Number(shiftInfo[s_key]);
            }
        });

        let production_data = {
            total_read: {label: 'Total inducted', count: 0},
            sc0: {label: 'Total good diverts', count: 0},
            machine_error: {label: 'Total machine error packages', count: 0},
            non_machine_error: {label: 'Total non-machine error packages', count: 0},
        };
        production_data['total_read']['count'] = shiftInfo['total_read'];
        production_data['sc0']['count'] = shiftInfo['sc0'];
        production_data['machine_error']['count'] = machine_errors;
        production_data['non_machine_error']['count'] = non_machine_errors;
        $('#table_production tbody').empty();
        Object.keys(production_data).forEach(key => {
            let html = '<tr>' + '<td>' + production_data[key]['label'] + '</td>' +
                '<td class="text-right">' + production_data[key]['count'] + '</td>' +
                '<td class="text-right">' + (shiftInfo['total_read'] > 0 ? (production_data[key]['count'] * 100 / shiftInfo['total_read']).toFixed(2) : '0') + '%' + '</td>'
                + '</tr>';
            $('#table_production tbody').append(html)
        });

        let scanner_data = {
            valid: {label: 'Good scan', count: 0},
            no_read: {label: 'No read', count: 0},
            no_code: {label: 'No code', count: 0},
            multiple_read: {label: 'Multiple read', count: 0},
        };
        scanner_data['valid']['count'] = shiftInfo['valid']
        scanner_data['no_read']['count'] = shiftInfo['no_read']
        scanner_data['no_code']['count'] = shiftInfo['no_code']
        scanner_data['multiple_read']['count'] = shiftInfo['multiple_read']

        $('#table_scanner tbody').empty();
        Object.keys(scanner_data).forEach(key => {
            let html = '<tr>' + '<td>' + scanner_data[key]['label'] + '</td>' +
                '<td class="text-right">' + scanner_data[key]['count'] + '</td>' +
                '<td class="text-right">' + (shiftInfo['total_read'] > 0 ? (scanner_data[key]['count'] * 100 / shiftInfo['total_read']).toFixed(2) : 0) + '%' + '</td>'
                + '</tr>';
            $('#table_scanner tbody').append(html)
        });
    }

}
function setStatisticsOee(statistics_oee){
    if(statistics_oee.length>0){
        let oeeInfo=statistics_oee[0];
        let oee_data = {
            cal_availability: {label: 'Availability'},
            cal_quality: {label: 'Quality'},
            cal_performance: {label: 'Performance'},
            cal_oee: {label: 'OEE'},
        };

        oeeInfo['cal_availability']= (+oeeInfo['tot_sec_blocked']) + (+oeeInfo['tot_sec_estop']) + (+oeeInfo['tot_sec_fault']) + (+oeeInfo['tot_sec_run'])
        oeeInfo['cal_availability']= (+oeeInfo['cal_availability'])>0? ((+oeeInfo['tot_sec_run'])/oeeInfo['cal_availability']).toFixed(2):'0';
        oeeInfo['cal_quality']= (+oeeInfo['packages_inducted'])>0?((+oeeInfo['successful_divert_packages'])/(+oeeInfo['packages_inducted'])).toFixed(2):'0';
        oeeInfo['cal_performance']= (+oeeInfo['tot_sec_run'])>0?((+oeeInfo['packages_inducted']) * (+oeeInfo['max_3min_tput'])/(+oeeInfo['tot_sec_run'])).toFixed(2):'0';
        oeeInfo['cal_oee']= ((+oeeInfo['cal_availability']) * (+oeeInfo['cal_quality']) * (+oeeInfo['cal_performance'])).toFixed(2)

        $('#table_oee tbody').empty();
        Object.keys(oee_data).forEach(key => {
            let html = '<tr>' + '<td>' + oee_data[key]['label'] + '</td>' +
                '<td class="text-right">' + oeeInfo[key] + '</td>' +
                + '</tr>';
            $('#table_oee tbody').append(html)
        });
    }
}