### Introduction 

**UploadFile is a middleware for user to upload their file more easier**

### 1. Install

**if you use npm/cnpm**

> npm/cnpm install @vinvincent/uploadfile 

**if you use yarn**

> yarn add @vinvincent/uploadfile

### 2. Usage

#### **At Client**

when you want to upload one file

``` html
<!-- use a input dom element to choose files -->
<input id="file" type="file">
<script>
    let file = document.getElementById('file').files[0];
    let fromData = new FormData();
    fromData.append('file', file);
    axios.post('your-interface', fromData, {
        "content-Type": "multipart/form-data"
    })
</script>
```

when you want to upload more than one file  

**set the input dom element attribute multiple to be true**

``` html
<!-- use a input dom element to choose files,set the attribute multiple to be true-->
<input id="file" type="file" multiple>
<script>
    let files = document.getElementById('file').files;
    let fromData
    if (files) {
        fromData = new FormData();
        for (file of files) {
            fromData.append('file', file);
        }
    }
    axios.post('your-interface', fromData, {
        "content-Type": "multipart/form-data"
    })
</script>
```

#### **At Server**

``` javascript
const uploadFile = require('@vinvincent/uploadFile')
//if you don't pass the parmas , the default path is `${process.cwd()} + './uploadfiles'`
app.use(uploadFile('your-uploadfile-path'))
```
