$(function () {
    //$(document).ajaxSend(function () {
    //    $("#common_waiting").modal('show');
    //});

    //$(document).ajaxComplete(function () {
    //    $("#common_waiting").modal('hide');
    //});

    var url_base = "";
    function showPage(page) {
        var $current_page = $("#common_current_page");
        var current_page_id = $current_page.val();
        if (current_page_id) {
            $("#" + current_page_id).hide();
        }

        $("#" + page).show();
        $current_page.val(page);
    }

    function isRegionManager() {
        var is_manager = $("#common_user_manager").val();
        return is_manager === "2";
    }

    //Common Clock
    function onCameraClockSuccess(imageData) {
        try {
            var $image = $("#common_camera_clock_image");
            $image.attr("src", "data:image/jpeg;base64," + imageData);

            $("#common_camera_clcok_data").val(imageData);

            $('#common_camera_clock_ok').removeAttr("disabled").html("Clock");
            $('#common_camera_clock_modal').modal('show');
        }
        catch (err) {
            alert(err);
        }
    }

    function onCameraClockFail(message) {
        if (message) {
            alert("Picture failure: " + message);
        }
    }

    function takeCameraClockPicture() {
        try {
            if (navigator.camera) {
                navigator.camera.getPicture(onCameraClockSuccess, onCameraClockFail, {
                    quality: 40,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 150,
                    targetHeight: 150
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
            var $this = $(this);
            var file = $this.get(0).files[0];
            if (!file)
                return;

            var reader = new FileReader();
            reader.onload = function (e) {
                var dataURL = e.target.result;
                var canvas = $("#common_camera_clock_canvas").get(0);

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
                    var base64 = canvas.toDataURL();
                    var imgData = base64.substr(22);
                    $("#common_camera_clock_data").val(imgData);

                    $('#common_camera_clock_ok').removeAttr("disabled").html("Clock");
                    $("#common_camera_clock_modal").modal('show');
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
            var $clock_dialog = $("#common_camera_clock_modal");
            var url = $clock_dialog.attr("data-url");
            var timesheetPK = $clock_dialog.attr("data-HRTimeSheetPK");
            var refresh_div = $clock_dialog.attr("data-refresh-div");
            var imgData = $("#common_camera_clock_data").val();

            if (timesheetPK && imgData) {
                $.ajax({
                    type: "post",
                    url: url_base + url,
                    data: { HRTimeSheetPK: timesheetPK, Photo: imgData },
                    success: function (data) {
                        if (data.OK) {
                            $("#" + refresh_div).html(data.Message);
                        } else {
                            alert(data.Message);
                        }

                        $clock_dialog.modal('hide');
                    },
                    error: function (x) {
                        alert("Failed:" + x.responseText);
                    }
                });
            }
        }
        catch (err) {
            alert("Preview Image: " + err);
        }

        return false;
    });

    //Common Status
    $(document).on("click", "#common_status_sick,#common_status_vacation,#common_status_absent,#common_status_terminate,#common_status_work", function () {
        var status = $(this).attr("data-status");

        var $status_dialog = $("#common_status_modal");
        var current_status = $status_dialog.attr("data-status");
        if (status === current_status) {
            $status_dialog.modal('hide');
            return false;
        }

        var url = $status_dialog.attr("data-url");
        var timesheetPK = $status_dialog.attr("data-HRTimeSheetPK");
        var refresh_div = $status_dialog.attr("data-refresh-div");
        
        $.ajax({
            type: "post",
            url: url_base + url,
            data: { HRTimeSheetPK: timesheetPK, statusType: status },
            success: function (data) {
                if (data.OK) {
                    $("#" + refresh_div).html(data.Message);
                } else {
                    alert(data.Message);
                }

                $status_dialog.modal('hide');
            },
            error: function (x) {
                alert("Failed:" + x.responseText);
            }
        });
       
        return false;
    });

    $(document).on("click", "#common_status_cancel", function () {
        $("#common_status_modal").modal('hide');
        return false;
    });

    //Employee Menu
    $(document).on("click", "#menu_employee", function () {
        $("#modal_employee_menu").modal('show');
        return false;
    });

    $(document).on("click", "#employee_menu_logout", function () {
        localStorage.removeItem('users');
        showPage("page_user");
        $("#modal_employee_menu").modal('hide');
        return false;
    });

    $(document).on("click", "#employee_menu_single_job", function () {
        localStorage.setItem('user_data_type', "0");
        $("#title_employee").attr("data-type", "0");
        $("[show-post]").css("display", "inline-block");
        $("[show-job]").css("display", "none");

        $("#modal_employee_menu").modal('hide');
        return false;
    });

    $(document).on("click", "#employee_menu_multi_job", function () {
        localStorage.setItem('user_data_type', "1");
        $("#title_employee").attr("data-type", "1");
        $("[show-post]").css("display", "none");
        $("[show-job]").css("display", "inline-block");

        $("#modal_employee_menu").modal('hide');
        return false;
    });

    $(document).on("click", "#employee_menu_cancel", function () {
        $("#modal_employee_menu").modal('hide');
        return false;
    });

    //Employee Search
    $(document).on("click", "#tools_employee_refresh", function () {
        var user_token = $("#common_user_token").val();
        if (!user_token) {
            return false;
        }

        var data_type = $("#title_employee").attr("data-type");
        
        $.ajax({
            type: "post",
            url: url_base + "/Employee/Search",
            data: { UserToken: user_token },
            success: function (msg) {
                if (msg.OK) {
                    $("#list_employee_timesheet").html(msg.Message);
                    if (data_type === "1") {
                        $("[show-post]").css("display", "none");
                        $("[show-job]").css("display", "inline-block");
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

    //Employee Functions
    $(document).on("click", "[data-employee-clock]", function () {
        var timesheetPK = $(this).attr("data-HRTimeSheetPK");
        $("#common_camera_clock_modal").attr("data-url", "/Employee/Clock")
            .attr("data-refresh-div", "div_employee_" + timesheetPK)
            .attr("data-HRTimeSheetPK", timesheetPK);
        
        takeCameraClockPicture();
        return false;
    });

    $(document).on("click", "[data-employee-status]", function () {
        var $this = $(this);
        var timesheetPK = $this.attr("data-HRTimeSheetPK");
        var status = $this.attr("data-employee-status");
        if (status === "5") {
            return false;
        }

        $("#common_status_modal").attr("data-url", "/Employee/Status")
            .attr("data-HRTimeSheetPK", timesheetPK)
            .attr("data-refresh-div", "div_employee_" + timesheetPK)
            .attr("data-status", status);

        $("#common_status_modal").modal('show');
        return false;
    });

    //Employee Add new
    $(document).on("click", "#tools_employee_add_timesheet", function () {
        $.ajax({
            type: "get",
            dataType: "json",
            url: url_base + "/Employee/AddNewTimeSheet",
            success: function (data) {
                if (data.OK) {
                    $("#form_employee_timesheet_add").html(data.Message);
                    showPage("page_employee_timesheet_add");
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

    $(document).on("click", "#back_employee_timesheet_add,#cancel_employee_timesheet_add", function () {
        showPage("page_employee");
        return false;
    });

    $(document).on("click", "#save_employee_timesheet_add", function () {
        var user_token = $("#common_user_token").val();
        if (!user_token) {
            return false;
        }

        $("#form_employee_timesheet_add [data-token]").val(user_token);
        var data_type = $("#title_employee").attr("data-type");

        $.ajax({
            type: "post",
            url: url_base + "/Employee/AddNewTimeSheet",
            data: $('#form_employee_timesheet_add').serialize(),
            success: function (msg) {
                if (msg.OK) {
                    $("#list_employee_timesheet").prepend(msg.Message);

                    if (data_type === "1") {
                        $("[show-post]").css("display", "none");
                        $("[show-job]").css("display", "inline-block");
                    }

                    showPage("page_employee");
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

    //Employee Detail
    $(document).on("click", "[data-employee-detail]", function () {
        var timesheetPK = $(this).attr("data-HRTimeSheetPK");
        $.ajax({
            type: "get",
            dataType: "json",
            url: url_base + "/Employee/TimeSheetDetail",
            data: { HRTimeSheetPK: timesheetPK },
            success: function (data) {
                if (data.OK) {
                    $("#detail_employee_timesheet").html(data.Message);
                    showPage("page_employee_timesheet_detail");
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

    $(document).on("click", "#back_employee_timesheet_detail,#cancel_employee_timesheet", function () {
        showPage("page_employee");
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

        var timesheetPK = $(this).attr("data-HRTimeSheetPK");

        $.ajax({
            type: "post",
            url: url_base + "/Employee/DeleteTimeSheet",
            data: { HRTimeSheetPK: timesheetPK },
            success: function (msg) {
                if (msg.OK) {
                    $("#div_employee_" + timesheetPK).remove();
                    showPage("page_employee");
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
        var timesheetPK = $(this).attr("data-HRTimeSheetPK");
        $.ajax({
            type: "get",
            dataType: "json",
            url: url_base + "/Employee/TimeSheetEdit",
            data: { HRTimeSheetPK: timesheetPK },
            success: function (data) {
                if (data.OK) {
                    $("#form_employee_timesheet_edit").html(data.Message);
                    $("#page_employee_timesheet_edit").attr("data-HRTimeSheetPK", timesheetPK);
                    showPage("page_employee_timesheet_edit");
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

    $(document).on("click", "#back_employee_timesheet_edit,#cancel_employee_timesheet_edit", function () {
        showPage("page_employee_timesheet_detail");
        return false;
    });

    $(document).on("click", "#save_employee_timesheet_edit", function () {
        var user_token = $("#common_user_token").val();
        if (!user_token) {
            return false;
        }

        var timesheetPK = $("#page_employee_timesheet_edit").attr("data-HRTimeSheetPK");

        $("#form_employee_timesheet_edit [data-token]").val(user_token);
        $("#form_employee_timesheet_edit [data-pk]").val(timesheetPK);

        var data_type = $("#title_employee").attr("data-type");

        $.ajax({
            type: "post",
            url: url_base + "/Employee/TimeSheetEdit",
            data: $('#form_employee_timesheet_edit').serialize(),
            success: function (msg) {
                if (msg.OK) {
                    $("#div_employee_" + timesheetPK).html(msg.Message);

                    if (data_type === "1") {
                        $("[show-post]").css("display", "none");
                        $("[show-job]").css("display", "inline-block");
                    }
                    showPage("page_employee");
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

    //Job Menu
    $(document).on("click", "#menu_job", function () {
        if (!isRegionManager()) {
            $("#job_menu_to_region").css("display", "none");
        }
        $("#modal_job_menu").modal('show');
        return false;
    });

    $(document).on("click", "#job_menu_logout", function () {
        localStorage.removeItem('users');
        localStorage.removeItem('job');
        showPage("page_user");
        $("#modal_job_menu").modal('hide');
        return false;
    });

    $(document).on("click", "#job_menu_change_password", function () {
        $("#modal_job_menu").modal('hide');
        $("#common_change_password_modal").modal('show');
        return false;
    });

    $(document).on("click", "#common_change_password_ok", function () {
        var user_token = $("#common_user_token").val();
        if (!user_token) {
            return false;
        }

        var oldPassword = $("#common_change_password_old_password").val();
        if (oldPassword.length <= 0) {
            alert("The old password can not be empty.");
            return false;
        }

        var newPassword = $("#common_change_password_new_password").val();
        if (newPassword.length <= 0) {
            alert("The new password can not be empty.");
            return false;
        }

        var confirmPassword = $("#common_change_password_confirm_password").val();
        if (confirmPassword.length <= 0) {
            alert("The confirm password can not be empty.");
            return false;
        }

        if (confirmPassword !== newPassword) {
            alert("The new password doesn't match the confirmed password you typed.  Please try it again.");
            return false;
        }

        $("#form_common_change_password [data-token]").val(user_token);

        $.ajax({
            type: "post",
            url: url_base + "/Home/ChangePassword",
            data: $('#form_common_change_password').serialize(),
            success: function (msg) {
                if (msg.OK) {
                    alert('Congratulation! Your password has been changed successfully.');
                    $("#common_change_password_modal").modal('hide');
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

    $(document).on("click", "#job_menu_to_region", function () {
        $("#modal_job_menu").modal('hide');

        var data_pk = $("#title_region").attr("data-pk");
        if (!data_pk) {
            var jobNumber = $("#title_job").attr("data-job");
            if (jobNumber) {
                $.ajax({
                    type: "post",
                    url: url_base + "/Region/SearchByJobNumber",
                    data: { JobNumber: jobNumber },
                    success: function (msg) {
                        if (msg.OK) {
                            $("#list_region_timesheet").html(msg.Message);
                            $("#title_region").html(msg.RegionName);
                            $("#title_region").attr("data-pk", msg.CoRegionPK);

                            $("#tools_region_refresh").css("display", "inline-block");
                        } else {
                            alert(msg.Message);
                        }
                    }
                });
            }
        }
        showPage("page_region");
        return false;
    });

    $(document).on("click", "#job_menu_cancel", function () {
        $("#modal_job_menu").modal('hide');
        return false;
    });

    //Job Search
    $(document).on("click", "#tools_job_serach_job", function () {   
        var job = $("#title_job").attr("data-job");
        if (job && job !== "null") {
            $("#input_job_serach_job_number").val(job);
        }

        $("#modal_job_serach_job").modal('show');
    });

    $(document).on("click", "#search_job_search_job", function () {
        var user_token = $("#common_user_token").val();
        if (user_token) {
            $("#form_job_search_job [data-token]").val(user_token);
        }

        var date = $("#title_job").attr("data-date");
        if (date && date !== "null") {
            $("#form_job_search_job [data-date]").val(date);
        }

        $.ajax({
            type: "post",
            url: url_base + "/Job/Search",
            data: $('#form_job_search_job').serialize(),
            success: function (msg) {
                if (msg.OK) {
                    $("#list_job_timesheet").html(msg.Message);
                    $("#title_job").html(msg.Title);
                    $("#title_job").attr("data-job", msg.JobNumber).attr("data-date", msg.DateTime);
                    localStorage.setItem('job', msg.JobNumber);

                    $("#tools_job_add_timesheet").css("display", "inline-block");
                    $("#tools_job_refresh").css("display", "inline-block");

                    $("#modal_job_serach_job").modal('hide');
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

    $(document).on("click", "#tools_job_serach_date", function () {
        var date = $("#title_job").attr("data-date");
        if (date && date !== "null") {
            $("#input_job_serach_datetime").val(date);
        }

        $("#modal_job_serach_date").modal('show');
    });

    $(document).on("click", "#search_job_search_date", function () {
        var user_token = $("#common_user_token").val();
        if (user_token) {
            $("#form_job_search_date [data-token]").val(user_token);
        }

        var job = $("#title_job").attr("data-job");
        if (job && job !== "null") {
            $("#form_job_search_date [data-job]").val(job);
        }

        $.ajax({
            type: "post",
            url: url_base + "/Job/Search",
            data: $('#form_job_search_date').serialize(),
            success: function (msg) {
                if (msg.OK) {
                    $("#list_job_timesheet").html(msg.Message);
                    $("#title_job").html(msg.Title);
                    $("#title_job").attr("data-job", msg.JobNumber).attr("data-date", msg.DateTime);

                    $("#tools_job_add_timesheet").css("display", "inline-block");
                    $("#tools_job_refresh").css("display", "inline-block");

                    $("#modal_job_serach_date").modal('hide');
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

    $(document).on("click", "#tools_job_refresh", function () {
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

        $.ajax({
            type: "post",
            url: url_base + "/Job/Search",
            data: { JobNumber: job, DateTime: date, UserToken: user_token },
            success: function (msg) {
                if (msg.OK) {
                    $("#list_job_timesheet").html(msg.Message);
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

    //Job Functions
    $(document).on("click", "[data-job-clock]", function () {
        var timesheetPK = $(this).attr("data-HRTimeSheetPK");
        $("#common_camera_clock_modal").attr("data-url", "/Job/Clock")
            .attr("data-refresh-div", "div_job_" + timesheetPK)
            .attr("data-HRTimeSheetPK", timesheetPK);
        
        takeCameraClockPicture();
        return false;
    });

    $(document).on("click", "[data-job-break]", function () {
        var timesheetPK = $(this).attr("data-HRTimeSheetPK");
        $.ajax({
            type: "post",
            dataType: "json",
            url: url_base + "/Job/Break",
            data: { HRTimeSheetPK: timesheetPK },
            success: function (data) {
                if (data.OK) {
                    $("#div_job_" + timesheetPK).html(data.Message);
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
        var timesheetPK = $this.attr("data-HRTimeSheetPK");
        var status = $this.attr("data-job-status");
        if (status === "5") {
            return false;
        }

        $("#common_status_modal").attr("data-url", "/Job/Status")
            .attr("data-HRTimeSheetPK", timesheetPK)
            .attr("data-refresh-div", "div_job_" + timesheetPK)
            .attr("data-status", status);

        $("#common_status_modal").modal('show');
        return false;
    });

    //Job Add new
    $(document).on("click", "#tools_job_add_timesheet", function () {
        $.ajax({
            type: "get",
            dataType: "json",
            url: url_base + "/Job/AddNewTimeSheet",
            success: function (data) {
                if (data.OK) {
                    $("#form_job_timesheet_add").html(data.Message);
                    showPage("page_job_timesheet_add");
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

    $(document).on("click", "#back_job_timesheet_add,#cancel_job_timesheet_add", function () {
        showPage("page_job");
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

        $("#form_job_timesheet_add [data-token]").val(user_token);
        $("#form_job_timesheet_add [data-date]").val(date);
        $("#form_job_timesheet_add [data-job]").val(job);

        $.ajax({
            type: "post",
            url: url_base + "/Job/AddNewTimeSheet",
            data: $('#form_job_timesheet_add').serialize(),
            success: function (msg) {
                if (msg.OK) {
                    $("#list_job_timesheet").append(msg.Message);
                    showPage("page_job");
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

    //Job Detail
    $(document).on("click", "[data-job-detail]", function () {
        var timesheetPK = $(this).attr("data-HRTimeSheetPK");
        $.ajax({
            type: "get",
            dataType: "json",
            url: url_base + "/Job/TimeSheetDetail",
            data: { HRTimeSheetPK: timesheetPK },
            success: function (data) {
                if (data.OK) {
                    $("#detail_job_timesheet").html(data.Message);

                    if (!isRegionManager()) {
                        $("#edit_job_timesheet").hide();
                        $("#delete_job_timesheet").hide();
                    }
                    showPage("page_job_timesheet_detail");
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

    $(document).on("click", "#back_job_timesheet_detail,#cancel_job_timesheet", function () {
        showPage("page_job");
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

        var timesheetPK = $(this).attr("data-HRTimeSheetPK");

        $.ajax({
            type: "post",
            url: url_base + "/Job/DeleteTimeSheet",
            data: { HRTimeSheetPK: timesheetPK },
            success: function (msg) {
                if (msg.OK) {
                    $("#div_job_" + timesheetPK).remove();
                    showPage("page_job");
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

    //Job Edit
    $(document).on("click", "#edit_job_timesheet", function () {
        var timesheetPK = $(this).attr("data-HRTimeSheetPK");
        $.ajax({
            type: "get",
            dataType: "json",
            url: url_base + "/Job/TimeSheetEdit",
            data: { HRTimeSheetPK: timesheetPK },
            success: function (data) {
                if (data.OK) {
                    $("#form_job_timesheet_edit").html(data.Message);
                    $("#page_job_timesheet_edit").attr("data-HRTimeSheetPK", timesheetPK);
                    showPage("page_job_timesheet_edit");
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

    $(document).on("click", "#back_job_timesheet_edit,#cancel_job_timesheet_edit", function () {
        showPage("page_job_timesheet_detail");
        return false;
    });

    $(document).on("click", "#save_job_timesheet_edit", function () {
        var user_token = $("#common_user_token").val();
        if (!user_token) {
            return false;
        }

        var timesheetPK = $("#page_job_timesheet_edit").attr("data-HRTimeSheetPK");

        $("#form_job_timesheet_edit [data-token]").val(user_token);
        $("#form_job_timesheet_edit [data-pk]").val(timesheetPK);

        $.ajax({
            type: "post",
            url: url_base + "/Job/TimeSheetEdit",
            data: $('#form_job_timesheet_edit').serialize(),
            success: function (msg) {
                if (msg.OK) {
                    $("#div_job_" + timesheetPK).html(msg.Message);
                    showPage("page_job");
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

    //Region Menu
    $(document).on("click", "#menu_region", function () {
        $("#modal_region_menu").modal('show');
        return false;
    });

    $(document).on("click", "#region_menu_logout", function () {
        localStorage.removeItem('users');
        localStorage.removeItem('job');
        showPage("page_user");
        $("#modal_region_menu").modal('hide');
        return false;
    });

    $(document).on("click", "#region_menu_change_password", function () {
        $("#modal_region_menu").modal('hide');
        $("#common_change_password_modal").modal('show');
        return false;
    });

    $(document).on("click", "#region_menu_to_job", function () {
        $("#modal_region_menu").modal('hide');
        showPage("page_job");
        return false;
    });

    $(document).on("click", "#region_menu_cancel", function () {
        $("#modal_region_menu").modal('hide');
        return false;
    });

    //Region Search
    $(document).on("click", "#tools_region_serach_name", function () {
        $("#modal_region_serach_name").modal('show');
    });

    $(document).on("click", "#search_region_search_name", function () {
        var user_token = $("#common_user_token").val();
        if (!user_token) {
            return false;
        }

        $("#form_region_search_name [data-token]").val(user_token);

        $.ajax({
            type: "post",
            url: url_base + "/Region/GetRegionList",
            data: $('#form_region_search_name').serialize(),
            success: function (msg) {
                if (msg.OK) {
                    if (msg.CoRegionPK) {
                        $("#list_region_timesheet").html(msg.Message);
                        $("#title_region").html(msg.RegionName);
                        $("#title_region").attr("data-pk", msg.CoRegionPK);

                        $("#tools_region_refresh").css("display", "inline-block");
                    } else {
                        $("#input_region_serach_pk").html(msg.Message);
                        $("#modal_region_serach_pk").modal('show');
                    }
                   
                    $("#modal_region_serach_name").modal('hide');
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

    $(document).on("click", "#search_region_search_pk", function () {
        var user_token = $("#common_user_token").val();
        if (!user_token) {
            return false;
        }

        $("#form_region_search_pk [data-token]").val(user_token);

        $.ajax({
            type: "post",
            url: url_base + "/Region/Search",
            data: $('#form_region_search_pk').serialize(),
            success: function (msg) {
                if (msg.OK) {
                    $("#list_region_timesheet").html(msg.Message);
                    $("#title_region").html(msg.RegionName);
                    $("#title_region").attr("data-pk", msg.CoRegionPK);

                    $("#tools_region_refresh").css("display", "inline-block");
                    $("#modal_region_serach_pk").modal('hide');
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

    $(document).on("click", "#tools_region_refresh", function () {
        var user_token = $("#common_user_token").val();
        if (!user_token) {
            return false;
        }

        var region_pk = $("#title_region").attr("data-pk");
        if (!region_pk || region_pk === "null") {
            return false;
        }

        $.ajax({
            type: "post",
            url: url_base + "/Region/Search",
            data: { UserToken: user_token, CoRegionPK: region_pk },
            success: function (msg) {
                if (msg.OK) {
                    $("#list_region_timesheet").html(msg.Message);
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

    //Region Edit
    $(document).on("click", "[data-region-edit]", function () {
        var timesheetPK = $(this).attr("data-HRTimeSheetPK");
        $.ajax({
            type: "get",
            dataType: "json",
            url: url_base + "/Region/TimeSheetEdit",
            data: { HRTimeSheetPK: timesheetPK },
            success: function (data) {
                if (data.OK) {
                    $("#form_region_timesheet_edit").html(data.Message);
                    $("#page_region_timesheet_edit").attr("data-HRTimeSheetPK", timesheetPK);
                    showPage("page_region_timesheet_edit");
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

    $(document).on("click", "#back_region_timesheet_edit,#cancel_region_timesheet_edit", function () {
        showPage("page_region");
        return false;
    });

    $(document).on("click", "#save_region_timesheet_edit", function () {
        var user_token = $("#common_user_token").val();
        if (!user_token) {
            return false;
        }

        var timesheetPK = $("#page_region_timesheet_edit").attr("data-HRTimeSheetPK");

        $("#form_region_timesheet_edit [data-token]").val(user_token);
        $("#form_region_timesheet_edit [data-pk]").val(timesheetPK);

        $.ajax({
            type: "post",
            url: url_base + "/Region/TimeSheetEdit",
            data: $('#form_region_timesheet_edit').serialize(),
            success: function (msg) {
                if (msg.OK) {
                    $("#div_region_" + timesheetPK).remove();
                    showPage("page_region");
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

    //Login
    $(document).on("click", "#button_user_login_ok", function () {
        
        var userId = $("#input_user_login_userId").val();
        if (userId.length <= 0) {
            alert("The user id can not be empty.");
            return false;
        }

        var password = $("#input_user_login_password").val();
        if (password.length <= 0) {
            alert("The password can not be empty.");
            return false;
        }

        $.ajax({
            type: "post",
            url: url_base + "/Home/Login",
            data: $('#form_user_login').serialize(),
            success: function (msg) {
                if (msg.OK) {
                    $("#common_user_token").val(msg.UserToken);
                    if (msg.IsManager) {
                        $("#common_user_manager").val("2");
                        $("#tools_job_serach_date").css("display", "inline-block");
                    } else {
                        $("#common_user_manager").val("1");
                        $("#tools_job_serach_date").css("display", "none");
                    }

                    if (msg.Remeberme) {
                        localStorage.setItem('users', msg.UserToken);
                    }

                    if (msg.IsEmployee) {
                        var data_type = localStorage.getItem('user_data_type');
                        if (!data_type) {
                            if (confirm("do you work at more than one job?")) {
                                data_type = "1";
                            } else {
                                data_type = "0";
                            }

                            localStorage.setItem('user_data_type', data_type);
                        }

                        $("#title_employee").attr("data-type", data_type);

                        $.ajax({
                            type: "post",
                            url: url_base + "/Employee/Search",
                            data: { UserToken: msg.UserToken },
                            success: function (data) {
                                if (data.OK) {
                                    $("#list_employee_timesheet").html(data.Message);
                                    $("#title_employee").html(data.FullName);

                                    if (data_type === "1") {
                                        $("[show-post]").css("display", "none");
                                        $("[show-job]").css("display", "inline-block");
                                    }
                                }
                            }
                        });

                        $("#tools_employee_refresh").css("display", "inline-block");
                        showPage("page_employee");

                    } else {
                        showPage("page_job");
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

    function autoLogin() {
        var user_token = localStorage.getItem('users');
        if (!user_token) {
            showPage("page_user");
            return;
        }

        $("#tools_employee_refresh").css("display", "none");

        $("#tools_job_refresh").css("display", "none");
        $("#tools_job_add_timesheet").css("display", "none");

        $("#tools_region_refresh").css("display", "none");

         $.ajax({
                    type: "post",
                    url: url_base + "/Home/Login",
                    data: { UserToken: user_token },
                    success: function (msg) {
                        if (msg.OK) {
                            $("#common_user_token").val(msg.UserToken);
                            if (msg.IsManager) {
                                $("#common_user_manager").val("2");
                                $("#tools_job_serach_date").css("display", "inline-block");
                            } else {
                                $("#common_user_manager").val("1");
                                $("#tools_job_serach_date").css("display", "none");
                            }
                            
                            if (msg.IsEmployee) {

                                var data_type = localStorage.getItem('user_data_type');
                                if (!data_type) {
                                    if (confirm("do you work at more than one job?")) {
                                        data_type = "1";
                                    } else {
                                        data_type = "0";
                                    }

                                    localStorage.setItem('user_data_type', data_type);
                                }

                                $("#title_employee").attr("data-type", data_type);

                                $.ajax({
                                    type: "post",
                                    url: url_base + "/Employee/Search",
                                    data: { UserToken: user_token },
                                    success: function(data) {
                                        if (data.OK) {
                                            $("#list_employee_timesheet").html(data.Message);
                                            $("#title_employee").html(data.FullName);

                                            if (data_type === "1") {
                                                $("[show-post]").css("display", "none");
                                                $("[show-job]").css("display", "inline-block");
                                            }
                                        }
                                    }
                                });
                                
                                $("#tools_employee_refresh").css("display", "inline-block");
                                showPage("page_employee");

                            } else {
                                var user_job = localStorage.getItem('job');
                                if (user_job) {
                                    $.ajax({
                                        type: "post",
                                        url: url_base + "/Job/Search",
                                        data: { UserToken: user_token, JobNumber: user_job },
                                        success: function(data) {
                                            if (data.OK) {
                                                $("#list_job_timesheet").html(data.Message);
                                                $("#title_job").html(data.Title);
                                                $("#title_job").attr("data-date", data.DateTime).attr("data-job", data.JobNumber);
                                            }
                                        }
                                    });
                                }

                                $("#tools_job_refresh").css("display", "inline-block");
                                $("#tools_job_add_timesheet").css("display", "inline-block");
                                showPage("page_job");
                            }
                        } else {
                            showPage("page_user");
                        }
                    },
                    error: function () {
                        showPage("page_user");
                    }
                });  
    }

    window.autoRemotingLogin = function (remote_url_base) {
        url_base = remote_url_base;
        autoLogin();
    }

    autoLogin();
});
