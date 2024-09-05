const url = `https://api.cloudinary.com/v1_1/${process.env.react_cloudinary_cloud_name}/auto/upload`

// const uploadfile = async(file)=>{
//     const formdata = new FormData();
//     formdata.append('file',file);
//     formdata.append("upload_present","chat-app-file")
//     const response = await fetch(url,{
//         method:'post',
//          body:formdata
//     })
//     const responsedata = await response.json();
//     return responsedata
// }

const uploadfile = async (file) => {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append("upload_preset", "chat-app-file");
    formdata.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
    formdata.append("timestamp", Date.now() / 1000);
  
    const response = await fetch(url, {
      method: 'POST',
      body: formdata
    });
  
    if (response.status === 401) {
      console.error('Unauthorized: Check your API credentials.');
      return null;
    }
  
    const responsedata = await response.json();
    return responsedata;
  }
  

export default uploadfile;