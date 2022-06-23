export function notifyComfirm(title,reply,callbak){
    Swal.fire({
      title: title,
      showCancelButton: true,
      confirmButtonText: 'Lưu',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        callbak();
        Swal.fire(reply, '', 'success')
      } 
    })
  }
  