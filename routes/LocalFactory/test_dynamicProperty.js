var sample = ['post_title', 'contact_phone', 'contact_email', 'address'];
var data = {};
data.fix = 100;
for(var i = 0;i< sample.length; i ++){
	data[sample[i]] = i;
}
console.log('data', data);