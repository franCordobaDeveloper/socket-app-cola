// Referencias html
const lblEscritorio = document.querySelector('h1');
const btnAtender    = document.querySelector('button');
const lblTicket     = document.getElementById('small');
const divAlerta     = document.getElementById('alerta');
const lblPendientes = document.getElementById('lblPendientes'); 

const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has('escritorio') ) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
// console.log({ escritorio });
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();


socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('', () => {

});

socket.on('tickets-pendientes', ( ticket ) => {
    if( ticket === 0 ) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
        lblPendientes.innerText = ticket;
    }
    
});

btnAtender.addEventListener('click', () => {
    
    socket.emit('atender-ticket', { escritorio } ,( { ok, ticket, msg } ) => {
        // console.log( payload );
        if( !ok ) {
            lblTicket.innerText = 'Nadie!';
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = `Ticket ` + ticket.numero;

    });

});