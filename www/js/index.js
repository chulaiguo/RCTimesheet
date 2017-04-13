(function(){ 

window.url_base = "";

window.myApp = new Framework7({
    //router: false
    //hideNavbarOnPageScroll: true,
    //hideToolbarOnPageScroll: true
    modalTitle: "Time Sheet",
    onAjaxStart: function () {
        myApp.showIndicator();
    },
    onAjaxComplete: function () {
        myApp.hideIndicator();
    }
});

window.alert = window.myApp.alert;

window.userView = myApp.addView('.view-user', { domCache: true });
window.employeeView = myApp.addView('.view-employee', { domCache: true });
window.jobView = myApp.addView('.view-job', { domCache: true });
window.regionView = myApp.addView('.view-region', { domCache: true });

function showUserPage(page) {
    window.myApp.showTab('#view-user');
    window.userView.router.load({ pageName: page });
}

function backUserPage() {
    window.userView.router.back();
}

function backToUserHome() {
    window.jobView.router.back({ pageName: "page_user", force: true });
}

function showEmployeePage(page) {
    window.myApp.showTab('#view-employee');
    window.employeeView.router.load({ pageName: page });
}

function backEmployeePage() {
    window.employeeView.router.back();
}

function backToEmployeeHome() {
    window.jobView.router.back({ pageName: "page_employee", force: true });
}

function showJobPage(page) {
    window.myApp.showTab('#view-job');
    window.jobView.router.load({ pageName: page });
}

function backJobPage() {
    window.jobView.router.back();
}

function backToJobHome() {
    window.jobView.router.back({ pageName: "page_job", force: true });
}

function showRegionPage(page) {
    window.myApp.showTab('#view-region');
    window.regionView.router.load({ pageName: page });
}

function backRegionPage() {
    window.regionView.router.back();
}

function backToRegionHome() {
    window.jobView.router.back({ pageName: "page_region", force: true });
}

window.$ = Dom7;

myApp.dataBinding = function ($target, data) {
    if ($target.length !== 1)
        return false;

    $target.find('[data-bind-text]').each(function () {
        var $this = $(this);
        var name = $this.attr('data-bind-text');
        if (typeof data[name] === 'undefined' || data[name] === null)
            return;

        $this.html(data[name]);
    });

    $target.find('[data-bind-value]').each(function () {
        var $this = $(this);
        var name = $this.attr('data-bind-value');
        if (typeof data[name] === 'undefined' || data[name] === null)
            return;

        $this.val(data[name]);
    });

    $target.find('[data-bind-attr]').each(function () {
        var $this = $(this);
        var name = $this.attr('data-bind-attr');
        if (typeof data[name] === 'undefined' || data[name] === null)
            return;

        $this.attr($this.attr('data-bind-attr-name'), data[name]);
    });

    $target.find('[data-bind-class]').each(function () {
        var $this = $(this);
        var name = $this.attr('data-bind-class');
        if (typeof data[name] === 'undefined' || data[name] === null)
            return;

        $this.addClass(data[name]);
    });

    $target.find('[data-bind-if]').each(function () {
        var $this = $(this);
        var name = $this.attr('data-bind-if');
        if (typeof data[name] === 'undefined' || data[name] === null)
            return;

        if ($this.attr('data-bind-if-value') === data[name].toString()) {
            $this.css("display", "inline-block");
        } else {
            $this.css("display", "none");
        }
    });

    return true;
};function isRegionManager() {
    var is_manager = $("#common_user_manager").val();
    return is_manager === "2";
}

//Common Clock
function onCameraClockSuccess(imageData) {
    try {
        var $image = $("#common_camera_clock_image");
        $image.attr("src", "data:image/jpeg;base64," + imageData);

        $("#common_camera_clock_data").val(imageData);

        $('#common_camera_clock_ok').removeAttr("disabled").html("Save");
        window.myApp.popup(".popup-camera-clock");
    }
    catch (err) {
        alert(err);
    }
}

function onCameraClockFail(message) {
    if (message) {
        //alert("Picture failure: " + message);
    }
}

function takeCameraClockPicture(pk, url) {
    try {
        $("#common_camera_clock_pk").val(pk);
        $("#common_camera_clock_url").val(url);

        if (navigator.camera) {
            navigator.camera.getPicture(onCameraClockSuccess, onCameraClockFail, {
                quality: 45,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 250,
                targetHeight: 250
            });
        } else {
            $("#common_camera_clock_file").trigger("click");
        }
    }
    catch (err) {
        alert("Take picture: " + err);
    }
}

$(document).on("change", "#common_camera_clock_file", function () {

    try {
        var file = this.files[0];
        if (!file)
            return;

        var reader = new FileReader();
        reader.onload = function (e) {
            var dataURL = e.target.result;
            var canvas = document.getElementById("common_camera_clock_canvas");

            var img = new Image();
            img.onload = function () {
                var square = 250;
                canvas.width = square;
                canvas.height = square;
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, square, square);

                var imageWidth;
                var imageHeight;
                var offsetX = 0;
                var offsetY = 0;
                if (this.width > this.height) {
                    imageWidth = Math.round(square * this.width / this.height);
                    imageHeight = square;
                    offsetX = -Math.round((imageWidth - square) / 2);
                } else {
                    imageHeight = Math.round(square * this.height / this.width);
                    imageWidth = square;
                    offsetY = -Math.round((imageHeight - square) / 2);
                }
                context.drawImage(this, offsetX, offsetY, imageWidth, imageHeight);
                var base64 = canvas.toDataURL("image/jpeg", 0.5);
                var imgData = base64.substr(23);
                $("#common_camera_clock_data").val(imgData);

                $('#common_camera_clock_ok').removeAttr("disabled").html("Save");
                window.myApp.popup(".popup-camera-clock");
            };
            img.src = dataURL;
        };
        reader.readAsDataURL(file);
    }
    catch (err) {
        alert("File Image: " + err);
    }
});

$(document).on("click", "#common_camera_clock_ok", function () {
    try {
        $(this).attr("disabled", "disabled").html('<i class="icon-spinner icon-spin icon-2x"></i>');

        var timesheetPK = $("#common_camera_clock_pk").val();
        var url = $("#common_camera_clock_url").val();
        var imgData = $("#common_camera_clock_data").val();

        //if (!imgData) {
        //    imgData = $("#common_camera_clock_image").attr("src").substr(23);
        //}

        if (timesheetPK && imgData) {
            $.ajax({
                type: "post",
                dataType: 'json',
                url: window.url_base + url,
                data: { HRTimeSheetPK: timesheetPK.split("|")[0], Photo: imgData },
                success: function (data) {
                    if (data.OK) {
                        window.myApp.dataBinding($("#" + timesheetPK), data.JsonData);
                    } else {
                        alert(data.Message);
                    }

                    window.myApp.closeModal(".popup-camera-clock");
                },
                error: function (x) {
                    $('#common_camera_clock_ok').removeAttr("disabled").html("Clock");
                    alert("Failed:" + x.responseText);
                }
            });
        }
    }
    catch (err) {
        $('#common_camera_clock_ok').removeAttr("disabled").html("Clock");
        alert("Preview Image: " + err);
    }

    return false;
});

$(document).on("click", "#menu_logout", function () {
    localStorage.removeItem('users');
    localStorage.removeItem('job');
    showUserPage("page_user");
    window.myApp.closePanel();
    return false;
});

$(document).on("click", "#menu_change_password", function () {
    showUserPage("page_user_change_password");
    window.myApp.closePanel();
    return false;
});

$(document).on("click", "#menu_job", function () {
    showJobPage("page_job");
    window.myApp.closePanel();
    return false;
});
$(document).on("click", "#menu_show_post", function () {
    localStorage.setItem('user_data_type', "0");
    $("#title_employee").attr("data-type", "0");
    $("[show-post]").css("display", "inline-block");
    $("[show-job]").css("display", "none");
    window.myApp.closePanel();
    return false;
});

$(document).on("click", "#menu_show_job", function () {
    localStorage.setItem('user_data_type', "1");
    $("#title_employee").attr("data-type", "1");
    $("[show-post]").css("display", "none");
    $("[show-job]").css("display", "inline-block");
    window.myApp.closePanel();
    return false;
});

$(document).on("click", "#menu_region", function () {
    var data_pk = $("#title_region").attr("data-pk");
    if (!data_pk) {
        var jobNumber = $("#title_job").attr("data-job");
        if (jobNumber) {
            $.ajax({
                type: "post",
                dataType: 'json',
                url: window.url_base + "/Region/SearchByJobNumber",
                data: { JobNumber: jobNumber },
                success: function (data) {
                    if (data.OK) {
                        $("#title_region").html(data.Message);
                        $("#title_region").attr("data-pk", data.CoRegionPK);

                        var $template = $("#template_region_timesheet");
                        var $template_detail = $("#template_region_timesheet_detail");
                        var $template_detail_place_holder = $("#template_region_timesheet_detail_placeholder");

                        var htmlArray = new Array(data.JsonData.length);
                        for (var i = 0; i < data.JsonData.length; i++) {
                            window.myApp.dataBinding($template, data.JsonData[i]);

                            $template_detail_place_holder.html();
                            for (var j = 0; j < data.JsonData[i].DetailList.length; j++) {
                                window.myApp.dataBinding($template_detail, data.JsonData[i].DetailList[j]);
                                $template_detail_place_holder.append($template_detail.html());
                            }

                            htmlArray[i] = $template.html();
                        }
                        $("#list_region_timesheet").html(htmlArray.join());
                    } else {
                        alert(data.Message);
                    }
                }
            });
        }
    }
    showRegionPage("page_region");
    window.myApp.closePanel();
    return false;
});
   //Employee Functions
$(document).on("click", "[data-employee-clock]", function () {
    var timesheetPK = $(this).parent().parent().parent().attr("id");
    takeCameraClockPicture(timesheetPK, "/Employee/Clock");
    return false;
});

$(document).on("click", "[data-employee-status]", function () {
    var $this = $(this);
    var timesheetPK = $(this).parent().parent().parent().attr("id");
    var status = $this.attr("data-employee-status");
    if (status === "5") {
        return false;
    }

    var buttons1 = [
        {
            text: 'Employee Status',
            label: true
        },
        {
            text: 'Sick',
            disabled: status === "1",
            bold: true,
            onClick: function () {
                markEmployeeStatus("1", timesheetPK);
            }
        },
        {
            text: 'Vacation',
            disabled: status === "2",
            onClick: function () {
                markEmployeeStatus("2", timesheetPK);
            }
        },
        {
            text: 'Absent',
            disabled: status === "3",
            onClick: function () {
                markEmployeeStatus("3", timesheetPK);
            }
        },
        {
            text: 'Work',
            disabled: status === "0",
            onClick: function () {
                markEmployeeStatus("0", timesheetPK);
            }
        },
        {
            text: 'Terminate',
            disabled: status === "4",
            onClick: function () {
                markEmployeeStatus("4", timesheetPK);
            }
        }
    ];
    var buttons2 = [
        {
            text: 'Cancel',
            color: 'red'
        }
    ];
    var groups = [buttons1, buttons2];
    window.myApp.actions(this, groups);

    return false;
});

function markEmployeeStatus(status, timesheetPK) {
    var reason = "";
    if (status === "4") {
        reason = prompt("Termination Reason", "");
        if (!reason) {
            return false;
        }
    }

    var user_token = $("#common_user_token").val();

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Employee/Status",
        data: { HRTimeSheetPK: timesheetPK.split("|")[0], statusType: status, UserToken: user_token, Notes: reason },
        success: function (data) {
            if (data.OK) {
                window.myApp.dataBinding($("#" + timesheetPK + "|Employee"), data.JsonData);
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
};

//Employee Add new
function onEmployeeNewClockSuccess(imageData) {
    try {
        var $image = $("#employee_clock_in_image");
        $image.attr("src", "data:image/jpeg;base64," + imageData);

        $("#employee_clock_in_data").val(imageData);
        showEmployeePage("page_employee_timesheet_add");
    }
    catch (err) {
        alert(err);
    }
}

function onEmployeeNewClockFail(message) {
    if (message) {
        //alert("Picture failure: " + message);
    }
}

$(document).on("change", "#employee_clock_in_file", function () {

    try {
        var file = this.files[0];
        if (!file)
            return;

        var reader = new FileReader();
        reader.onload = function (e) {
            var dataURL = e.target.result;
            var canvas = document.getElementById("employee_clock_in_canvas");

            var img = new Image();
            img.onload = function () {
                var square = 250;
                canvas.width = square;
                canvas.height = square;
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, square, square);

                var imageWidth;
                var imageHeight;
                var offsetX = 0;
                var offsetY = 0;
                if (this.width > this.height) {
                    imageWidth = Math.round(square * this.width / this.height);
                    imageHeight = square;
                    offsetX = -Math.round((imageWidth - square) / 2);
                } else {
                    imageHeight = Math.round(square * this.height / this.width);
                    imageWidth = square;
                    offsetY = -Math.round((imageHeight - square) / 2);
                }
                context.drawImage(this, offsetX, offsetY, imageWidth, imageHeight);
                var base64 = canvas.toDataURL("image/jpeg", 0.5);
                var imgData = base64.substr(23);
                $("#employee_clock_in_data").val(imgData);

                showEmployeePage("page_employee_timesheet_add");
            };
            img.src = dataURL;
        };
        reader.readAsDataURL(file);
    }
    catch (err) {
        alert("File Image: " + err);
    }
});


function takeEmployeeNewClockPicture() {
    try {
        if (navigator.camera) {
            navigator.camera.getPicture(onEmployeeNewClockSuccess, onEmployeeNewClockFail, {
                quality: 45,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 250,
                targetHeight: 250
            });
        }
        else {
            $("#employee_clock_in_file").trigger("click");
        }
    }
    catch (err) {
        alert("Take picture: " + err);
    }
}

$(document).on("click", "#tools_employee_add_timesheet", function () {
    takeEmployeeNewClockPicture();
    return false;
});

$(document).on("click", "#save_employee_timesheet_add", function () {
    var user_token = $("#common_user_token").val();
    if (!user_token) {
        return false;
    }

    $("#form_employee_timesheet_add [name='UserToken']").val(user_token);

    var data_type = $("#title_employee").attr("data-type");

    var model = window.myApp.formToJSON('#form_employee_timesheet_add');
    if (!model.JobNumber) {
        alert("The job number can not be empty.");
        return false;
    }

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Employee/AddNewTimeSheet",
        data: model,
        success: function (data) {
            if (data.OK) {
                var $template = $("#template_employee_timesheet");
                window.myApp.dataBinding($template, data.JsonData);
                $("#list_employee_timesheet").append($template.html());

                if (data_type === "1") {
                    $("[show-post]").css("display", "none");
                    $("[show-job]").css("display", "inline-block");
                }

                backEmployeePage();
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });
    return false;
});

//Employee Detail
$(document).on("click", "[data-employee-detail]", function () {
    var timesheetPK = $(this).parent().parent().parent().attr("id");
    $.ajax({
        type: "get",
        dataType: "json",
        url: window.url_base + "/Employee/TimeSheetDetail",
        data: { HRTimeSheetPK: timesheetPK.split("|")[0] },
        success: function (data) {
            if (data.OK) {
                window.myApp.dataBinding($("#form_employee_timesheet_detail"), data.JsonData);
                showEmployeePage("page_employee_timesheet_detail");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#delete_employee_timesheet", function () {
    if (!confirm("Are you sure you want to delete?")) {
        return false;
    }

    var user_token = $("#common_user_token").val();
    if (!user_token) {
        return false;
    }

    var timesheetPK = $("#form_employee_timesheet_detail [data-bind-value='HRTimeSheetPK']").val();

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Employee/DeleteTimeSheet",
        data: { HRTimeSheetPK: timesheetPK },
        success: function (msg) {
            if (msg.OK) {
                $("#" + timesheetPK + "|Employee").remove();
                backEmployeePage();
            } else {
                alert(msg.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });
    return false;
});

//Employee Edit
$(document).on("click", "#edit_employee_timesheet", function () {
    var timesheetPK = $("#form_employee_timesheet_detail [data-bind-value='HRTimeSheetPK']").val();
    $.ajax({
        type: "get",
        dataType: "json",
        url: window.url_base + "/Employee/TimeSheetEdit",
        data: { HRTimeSheetPK: timesheetPK },
        success: function (data) {
            if (data.OK) {
                window.myApp.formFromJSON("#form_employee_timesheet_edit", data.JsonData);
                showEmployeePage("page_employee_timesheet_edit");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#save_employee_timesheet_edit", function () {
    var user_token = $("#common_user_token").val();
    if (!user_token) {
        return false;
    }

    $("#form_employee_timesheet_edit [name='UserToken']").val(user_token);
    var timesheetPK = $("#form_employee_timesheet_edit [name='HRTimeSheetPK']").val();

    var data_type = $("#title_employee").attr("data-type");

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Employee/TimeSheetEdit",
        data: window.myApp.formToJSON('#form_employee_timesheet_edit'),
        success: function (data) {
            if (data.OK) {
                window.myApp.dataBinding($("#" + timesheetPK + "|Employee"), data.JsonData);

                if (data_type === "1") {
                    $("[show-post]").css("display", "none");
                    $("[show-job]").css("display", "inline-block");
                }
                backToEmployeeHome();
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });
    return false;
});
//Job Search
$(document).on("click", "#search_job_number", function () {
    var $this = $(this);
    var dispaly = $this.html();
    $this.attr("disabled", "disabled").html('<i class="icon-spinner icon-spin icon-2x"></i>');

    var user_token = $("#common_user_token").val();
    if (user_token) {
        $("#form_job_search_job [name='UserToken']").val(user_token);
    }

    var date = $("#title_job").attr("data-date");
    if (date && date !== "null") {
        $("#form_job_search_job [name='DateTime']").val(date);
    }

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Job/Search",
        data: window.myApp.formToJSON('#form_job_search_job'),
        success: function (data) {
            if (data.OK) {
                $("#title_job").html(data.Message);
                $("#title_job").attr("data-date", data.DateTime).attr("data-job", data.JobNumber);

                var $template = $("#template_job_timesheet");
                var htmlArray = new Array(data.JsonData.length);
                for (var i = 0; i < data.JsonData.length; i++) {
                    window.myApp.dataBinding($template, data.JsonData[i]);
                    htmlArray[i] = $template.html();
                }
                $("#list_job_timesheet").html(htmlArray.join());

                localStorage.setItem('job', data.JobNumber);
                $("#tools_job_add_timesheet").css("display", "inline-block");

                $this.removeAttr("disabled").html(dispaly);
                window.myApp.closeModal(".picker-modal-job-number");

            } else {
                $this.removeAttr("disabled").html(dispaly);
                alert(data.Message);
            }
        },
        error: function (x) {
            $this.removeAttr("disabled").html(dispaly);
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#search_job_date", function () {
    var $this = $(this);
    var dispaly = $this.html();
    $this.attr("disabled", "disabled").html('<i class="icon-spinner icon-spin icon-2x"></i>');

    var user_token = $("#common_user_token").val();
    if (user_token) {
        $("#form_job_search_date [name='UserToken']").val(user_token);
    }

    var job = $("#title_job").attr("data-job");
    if (job && job !== "null") {
        $("#form_job_search_date [name='JobNumber']").val(job);
    }

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Job/Search",
        data: window.myApp.formToJSON('#form_job_search_date'),
        success: function (data) {
            if (data.OK) {
                $("#title_job").html(data.Message);
                $("#title_job").attr("data-date", data.DateTime).attr("data-job", data.JobNumber);

                var $template = $("#template_job_timesheet");
                var htmlArray = new Array(data.JsonData.length);
                for (var i = 0; i < data.JsonData.length; i++) {
                    window.myApp.dataBinding($template, data.JsonData[i]);
                    htmlArray[i] = $template.html();
                }
                $("#list_job_timesheet").html(htmlArray.join());

                $("#tools_job_add_timesheet").css("display", "inline-block");

                $this.removeAttr("disabled").html(dispaly);
                window.myApp.closeModal(".picker-modal-job-date");
            } else {
                $this.removeAttr("disabled").html(dispaly);
                alert(data.Message);
            }
        },
        error: function (x) {
            $this.removeAttr("disabled").html(dispaly);
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

//Job Functions
$(document).on("click", "[data-job-clock]", function () {
    var timesheetPK = $(this).parent().parent().parent().attr("id");
    takeCameraClockPicture(timesheetPK, "/Job/Clock");
    return false;
});

$(document).on("click", "[data-job-break]", function () {
    var timesheetPK = $(this).parent().parent().parent().attr("id");
    $.ajax({
        type: "post",
        dataType: "json",
        url: window.url_base + "/Job/Break",
        data: { HRTimeSheetPK: timesheetPK.split("|")[0] },
        success: function (data) {
            if (data.OK) {
                window.myApp.dataBinding($("#" + timesheetPK), data.JsonData);
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "[data-job-status]", function () {
    var $this = $(this);
    var timesheetPK = $(this).parent().parent().parent().attr("id");
    var status = $this.attr("data-job-status");
    if (status === "5") {
        return false;
    }

    var buttons1 = [
        {
            text: 'Employee Status',
            label: true
        },
        {
            text: 'Sick',
            disabled: status === "1",
            bold: true,
            onClick: function () {
                markJobEmployeeStatus("1", timesheetPK);
            }
        },
        {
            text: 'Vacation',
            disabled: status === "2",
            onClick: function () {
                markJobEmployeeStatus("2", timesheetPK);
            }
        },
        {
            text: 'Absent',
            disabled: status === "3",
            onClick: function () {
                markJobEmployeeStatus("3", timesheetPK);
            }
        },
        {
            text: 'Work',
            disabled: status === "0",
            onClick: function () {
                markJobEmployeeStatus("0", timesheetPK);
            }
        },
        {
            text: 'Terminate',
            disabled: status === "4",
            onClick: function () {
                markJobEmployeeStatus("4", timesheetPK);
            }
        }
    ];
    var buttons2 = [
        {
            text: 'Cancel',
            color: 'red'
        }
    ];
    var groups = [buttons1, buttons2];
    window.myApp.actions(this, groups);

    return false;
});

function markJobEmployeeStatus(status, timesheetPK)
{
    var reason = "";
    if (status === "4") {
        reason = prompt("Termination Reason", "");
        if (!reason) {
            return false;
        }
    }

    var user_token = $("#common_user_token").val();

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Job/Status",
        data: { HRTimeSheetPK: timesheetPK.split("|")[0], statusType: status, UserToken: user_token, Notes: reason },
        success: function (data) {
            if (data.OK) {
                window.myApp.dataBinding($("#" + timesheetPK), data.JsonData);
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
};


//Job Add new
$(document).on("click", "#tools_job_add_timesheet", function () {
    showJobPage("page_job_timesheet_add");
    return false;
});

$(document).on("click", "#save_job_timesheet_add", function () {
    var user_token = $("#common_user_token").val();
    if (!user_token) {
        return false;
    } 

    var job = $("#title_job").attr("data-job");
    if (!job || job === "null") {
        return false;
    }

    var date = $("#title_job").attr("data-date");
    if (!date || date === "null") {
        return false;
    }

    $("#form_job_timesheet_add [name='UserToken']").val(user_token);
    $("#form_job_timesheet_add [name='JobNumber']").val(job);
    $("#form_job_timesheet_add [name='DateTime']").val(date);

    var model = window.myApp.formToJSON('#form_job_timesheet_add');

    if (!model.EmpID) {
        alert("The employee id can not be empty.");
        return false;
    }

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Job/AddNewTimeSheet",
        data: model,
        success: function (data) {
            if (data.OK) {
                var $template = $("#template_job_timesheet");
                window.myApp.dataBinding($template, data.JsonData);
                $("#list_job_timesheet").append($template.html());

                backJobPage();
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });
    return false;
});

//Job Detail
$(document).on("click", "[data-job-detail]", function () {
    var timesheetPK = $(this).parent().parent().parent().attr("id");
    $.ajax({
        type: "get",
        dataType: "json",
        url: window.url_base + "/Job/TimeSheetDetail",
        data: { HRTimeSheetPK: timesheetPK.split("|")[0] },
        success: function (data) {
            if (data.OK) {
                window.myApp.dataBinding($("#form_job_timesheet_detail"), data.JsonData);
                if (!isRegionManager()) {
                    $("#edit_job_timesheet").hide();
                    $("#delete_job_timesheet").hide();
                }
                showJobPage("page_job_timesheet_detail");
            } else {
                alert(data.ErrorMessage);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#delete_job_timesheet", function () {
    if (!confirm("Are you sure you want to delete?")) {
        return false;
    }

    var user_token = $("#common_user_token").val();
    if (!user_token) {
        return false;
    }

    var timesheetPK = $("#form_job_timesheet_detail [data-bind-value='HRTimeSheetPK']").val();

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Job/DeleteTimeSheet",
        data: { HRTimeSheetPK: timesheetPK },
        success: function (data) {
            if (data.OK) {
                $("#" + timesheetPK + "|Job").remove();
                backJobPage();
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });
    return false;
});

//Job Edit
$(document).on("click", "#edit_job_timesheet", function () {
    var timesheetPK = $("#form_job_timesheet_detail [data-bind-value='HRTimeSheetPK']").val();
    $.ajax({
        type: "get",
        dataType: "json",
        url: window.url_base + "/Job/TimeSheetEdit",
        data: { HRTimeSheetPK: timesheetPK },
        success: function (data) {
            if (data.OK) {
                window.myApp.formFromJSON("#form_job_timesheet_edit", data.JsonData);
                showJobPage("page_job_timesheet_edit");
            } else {
                alert(data.ErrorMessage);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#save_job_timesheet_edit", function () {
    var user_token = $("#common_user_token").val();
    if (!user_token) {
        return false;
    }

    $("#form_job_timesheet_edit [name='UserToken']").val(user_token);
    var timesheetPK = $("#form_job_timesheet_edit [name='HRTimeSheetPK']").val();

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Job/TimeSheetEdit",
        data: window.myApp.formToJSON('#form_job_timesheet_edit'),
        success: function (data) {
            if (data.OK) {
                window.myApp.dataBinding($("#" +timesheetPK + "|Job"), data.JsonData);
                backToJobHome();
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });
    return false;
});
//Region Search
$(document).on("click", "#search_region_name", function () {
    var user_token = $("#common_user_token").val();
    if (!user_token) {
        return false;
    }

    $("#form_region_search_name [name='UserToken']").val(user_token);

    var $this = $(this);
    var dispaly = $this.html();
    $this.attr("disabled", "disabled").html('<i class="fa fa-spinner fa-spin fa-2x"></i>');

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Region/GetRegionList",
        data: window.myApp.formToJSON('#form_region_search_name'),
        success: function (data) {
            if (data.OK) {
                var htmlArray = new Array(data.JsonData.length);
                for (var i = 0; i < data.JsonData.length; i++) {
                    htmlArray[i] = "<option value='" + data.JsonData[i].DropdownValue + "'>" + data.JsonData[i].DropdownText + "</option>";
                }

                $("#form_region_search_pk [name='RegionPK']").html(htmlArray.join());
                $this.removeAttr("disabled").html(dispaly);
                window.myApp.closeModal(".picker-modal-region-name");

                window.myApp.pickerModal(".picker-modal-region-pk");
            } else {
                $this.removeAttr("disabled").html(dispaly);
                alert(data.Message);
            }
        },
        error: function (x) {
            $this.removeAttr("disabled").html(dispaly);
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#search_region_pk", function () {
    var $this = $(this);
    var dispaly = $this.html();
    $this.attr("disabled", "disabled").html('<i class="fa fa-spinner fa-spin fa-2x"></i>');

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Region/SearchByRegion",
        data: window.myApp.formToJSON('#form_region_search_pk'),
        success: function (data) {
            if (data.OK) {
                $("#title_region").html(data.Message);
                $("#title_region").attr("data-pk", data.CoRegionPK);

                var $template = $("#template_region_timesheet");                
                var $template_detail = $("#template_region_timesheet_detail");
                var $template_detail_place_holder = $("#template_region_timesheet_detail_placeholder");

                var htmlArray = new Array(data.JsonData.length);
                for (var i = 0; i < data.JsonData.length; i++) {
                    window.myApp.dataBinding($template, data.JsonData[i]);

                    $template_detail_place_holder.html();
                    for (var j = 0; j < data.JsonData[i].DetailList.length; j++) {
                        window.myApp.dataBinding($template_detail, data.JsonData[i].DetailList[j]);
                        $template_detail_place_holder.append($template_detail.html());
                    }

                    htmlArray[i] = $template.html();
                }
                $("#list_region_timesheet").html(htmlArray.join());

                $this.removeAttr("disabled").html(dispaly);
                window.myApp.closeModal(".picker-modal-region-pk");
            } else {
                $this.removeAttr("disabled").html(dispaly);
                alert(data.Message);
            }
        },
        error: function (x) {
            $this.removeAttr("disabled").html(dispaly);
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

//Region Edit
$(document).on("click", "[data-region-edit]", function () {
    var timesheetPK = $(this).parent().parent().parent().attr("id");
    $.ajax({
        type: "get",
        dataType: "json",
        url: window.url_base + "/Region/TimeSheetEdit",
        data: { HRTimeSheetPK: timesheetPK.split("|")[0] },
        success: function (data) {
            if (data.OK) {
                window.myApp.formFromJSON("#form_region_timesheet_edit", data.JsonData);
                showRegionPage("page_region_timesheet_edit");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#save_region_timesheet_edit", function () {
    var user_token = $("#common_user_token").val();
    if (!user_token) {
        return false;
    }

    $("#form_region_timesheet_edit [name='UserToken']").val(user_token);
    var timesheetPK = $("#form_region_timesheet_edit [name='HRTimeSheetPK']").val();

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Region/TimeSheetEdit",
        data: window.myApp.formToJSON('#form_region_timesheet_edit'),
        success: function (data) {
            if (data.OK) {
                window.myApp.dataBinding($("#" + timesheetPK + "|Region"), data.JsonData);
                backRegionPage();
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });
    return false;
});//Login
$(document).on("click", "#signin_user_login", function () {
    var model = window.myApp.formToJSON('#form_user_login');

    if (model.UserId.length <= 0) {
        alert("The user id can not be empty.");
        return false;
    }

    if (model.Password.length <= 0) {
        alert("The password can not be empty.");
        return false;
    }

    $.ajax({
        type: "post",
        dataType:'json',
        url: window.url_base + "/Home/Login",
        data: model,
        success: function (msg) {
            if (msg.OK) {
                $("#common_user_token").val(msg.UserToken);
                if (msg.IsManager) {
                    $("#common_user_manager").val("2");
                    $("#tools_job_serach_date").css("display", "inline-block");

                    $("#menu_region").css("display", "inline-block");
                    $("#menu_job").css("display", "inline-block");
                    $("#menu_change_password").css("display", "inline-block");
                    $("#menu_show_post").css("display", "none");
                    $("#menu_show_job").css("display", "none");

                } else {
                    $("#common_user_manager").val("1");
                    $("#tools_job_serach_date").css("display", "none");

                    $("#menu_region").css("display", "none");
                    $("#menu_job").css("display", "none");
                    $("#menu_change_password").css("display", "none");
                    $("#menu_show_post").css("display", "inline-block");
                    $("#menu_show_job").css("display", "inline-block");
                }

                if (msg.Remeberme) {
                    localStorage.setItem('users', msg.UserToken);
                }

                if (msg.IsEmployee) {
                    var data_type = localStorage.getItem('user_data_type');
                    if (!data_type) {
                        data_type = "0";
                        //if (confirm("do you work at more than one job?")) {
                        //    data_type = "1";
                        //} else {
                        //    data_type = "0";
                        //}                           
                    }

                    localStorage.setItem('user_data_type', data_type);
                    $("#title_employee").attr("data-type", data_type);

                    $.ajax({
                        type: "post",
                        dataType: 'json',
                        url: window.url_base + "/Employee/Search",
                        data: { UserToken: msg.UserToken },
                        success: function (data) {
                            if (data.OK) {
                                $("#title_employee").html(data.Message);

                                var $template = $("#template_employee_timesheet");
                                var htmlArray = new Array(data.JsonData.length);
                                for (var i = 0; i < data.JsonData.length; i++) {
                                    window.myApp.dataBinding($template, data.JsonData[i]);
                                    htmlArray[i] = $template.html();
                                }
                                $("#list_employee_timesheet").html(htmlArray.join());

                                if (data_type === "1") {
                                    $("[show-post]").css("display", "none");
                                    $("[show-job]").css("display", "inline-block");
                                }
                            }
                        }
                    });

                    showEmployeePage("page_employee");

                } else {
                    showJobPage("page_job");
                }
            } else {
                alert(msg.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#ok_user_change_passord", function () {
    var user_token = $("#common_user_token").val();
    if (user_token) {
        $("#form_user_change_password [name='UserToken']").val(user_token);
    }

    var model = window.myApp.formToJSON('#form_user_change_password');

    if (model.OldPassword.length <= 0) {
        alert("The old password can not be empty.");
        return false;
    }

    if (model.NewPassword.length <= 0) {
        alert("The new password can not be empty.");
        return false;
    }

    if (model.ConfirmPassword.length <= 0) {
        alert("The confirm password can not be empty.");
        return false;
    }

    if (model.ConfirmPassword !== model.NewPassword) {
        alert("The confirm password is not equal to new password.");
        return false;
    }

    $.ajax({
        type: "post",
        dataType: 'json',
        url: window.url_base + "/Home/ChangePassword",
        data: model,
        success: function (data) {
            if (data.OK) {
                alert("Your password has been modified.");
                showUserPage("page_user");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#cancel_user_change_passord", function () {
    showJobPage("page_job");
    return false;
});

function autoLogin() {
    var company_name = $("#common_comapny_name").val();
    if (!company_name) {
        return;
    }

    var link = document.createElement("link");
    link.href = window.url_base + "/css/" + company_name + ".css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);

    var user_token = localStorage.getItem('users');
    if (!user_token) {
        showUserPage("page_user");
        return;
    }

    $("#tools_job_add_timesheet").css("display", "none");

        $.ajax({
                type: "post",
                dataType: 'json',
                url: window.url_base + "/Home/Login",
                data: { UserToken: user_token },
                success: function (msg) {
                    if (msg.OK) {
                        $("#common_user_token").val(msg.UserToken);
                        if (msg.IsManager) {
                            $("#common_user_manager").val("2");
                            $("#tools_job_serach_date").css("display", "inline-block");

                            $("#menu_region").css("display", "inline-block");
                            $("#menu_job").css("display", "inline-block");
                            $("#menu_change_password").css("display", "inline-block");
                            $("#menu_show_post").css("display", "none");
                            $("#menu_show_job").css("display", "none");
                        } else {
                            $("#common_user_manager").val("1");
                            $("#tools_job_serach_date").css("display", "none");

                            $("#menu_region").css("display", "none");
                            $("#menu_job").css("display", "none");
                            $("#menu_change_password").css("display", "none");
                            $("#menu_show_post").css("display", "inline-block");
                            $("#menu_show_job").css("display", "inline-block");
                        }
                            
                        if (msg.IsEmployee) {

                            var data_type = localStorage.getItem('user_data_type');
                            if (!data_type) {
                                data_type = "0";
                                //if (confirm("do you work at more than one job?")) {
                                //    data_type = "1";
                                //} else {
                                //    data_type = "0";
                                //}  
                            }

                            localStorage.setItem('user_data_type', data_type);
                            $("#title_employee").attr("data-type", data_type);

                            $.ajax({
                                type: "post",
                                dataType: 'json',
                                url: window.url_base + "/Employee/Search",
                                data: { UserToken: user_token },
                                success: function(data) {
                                    if (data.OK) {
                                        $("#title_employee").html(data.Message);

                                        var $template = $("#template_employee_timesheet");
                                        var htmlArray = new Array(data.JsonData.length);
                                        for (var i = 0; i < data.JsonData.length; i++) {
                                            window.myApp.dataBinding($template, data.JsonData[i]);
                                            htmlArray[i] = $template.html();
                                        }
                                        $("#list_employee_timesheet").html(htmlArray.join());

                                        if (data_type === "1") {
                                            $("[show-post]").css("display", "none");
                                            $("[show-job]").css("display", "inline-block");
                                        }
                                    }
                                }
                            });
                                
                            showEmployeePage("page_employee");

                        } else {
                            var user_job = localStorage.getItem('job');
                            if (user_job) {
                                $.ajax({
                                    type: "post",
                                    dataType: 'json',
                                    url: window.url_base + "/Job/Search",
                                    data: { UserToken: user_token, JobNumber: user_job },
                                    success: function (data) {
                                        if (data.OK) {
                                            $("#title_job").html(data.Message);
                                            $("#title_job").attr("data-date", data.DateTime).attr("data-job", data.JobNumber);

                                            var $template = $("#template_job_timesheet");
                                            var htmlArray = new Array(data.JsonData.length);
                                            for (var i = 0; i < data.JsonData.length; i++) {
                                                window.myApp.dataBinding($template, data.JsonData[i]);
                                                htmlArray[i] = $template.html();
                                            }
                                            $("#list_job_timesheet").html(htmlArray.join());

                                            $("#tools_job_add_timesheet").css("display", "inline-block");
                                        }
                                    }
                                });
                            }

                            showJobPage("page_job");
                        }
                    } else {
                        showUserPage("page_user");
                    }
                },
                error: function () {
                    showUserPage("page_user");
                }
            });  
}

window.autoRemotingLogin = function (remote_url_base) {
    window.url_base = remote_url_base;
    autoLogin();
}

autoLogin();

})(); 