// Referencias html
const lblNuevoTicket = document.getElementById('lblNuevoTicket');
const btnCrear       = document.querySelector('button');

const socket = io();


socket.on('connect', () => {
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    btnCrear.disabled = true;
});

socket.on('ultimo-ticket', ( ticket ) => {
    lblNuevoTicket.innerText = 'Ultimo Ticket: ' + ticket;
})

btnCrear.addEventListener('click', () => {
    
    socket.emit('siguiente-ticket', null , ( ticket ) => {
        lblNuevoTicket.innerText = ticket;
    });

});