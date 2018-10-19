import $ from 'jquery';
import * as _ from 'lodash';

// An array, object or any data (eg. from an ajax call)
let users = ['fred', 'barney', 'pebble', 'wilma', 'betty', 'bambam'];

let person = {
    name: 'fred',
    occupation: 'quarry worker',
    hobbies: 'bowling'
};

// Set the HTML template
let userlist = _.template($('#userlist').html());
let bio = _.template($('#bio').html());

let x = userlist({ users });


// render the template using hte data
$('#content').html(userlist({ users }));
$('#content').after(bio(person));

var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
const r = compiled({ 'users': ['fred', 'barney'] });

console.log(r);
