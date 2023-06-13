const path = require('path');
const fs   = require('fs');

class Ticket {

    constructor( numero, escritorio  ) {
        this.numero     = numero; 
        this.escritorio = escritorio
    }
}


class TicketControl {

    constructor() {

        this.ultimo   = 0;        // Ultimo ticket que se esta atendiendo
        this.hoy      = new Date().getDate();
        this.tickets  = [];      // Manejar los tickets pendientes 
        this.ultimos4 = [];      // Manejar los ultimos 4 tickets


        this.init();
    }

    
    get toJson() {
        return {
            ultimo:   this.ultimo,
            hoy:      this.hoy,
            tickets:  this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init() {

        try {
            const { hoy, tickets, ultimo, ultimos4 } = require('../db/data.json');
            // console.log( data );

            // Si la condicion se cumple significa que estoy trabajando en el mismo dia
            // Y por lo tanto se esta reiniciando el servidor
            if( hoy === this.hoy ) {
                this.tickets  = tickets;
                this.ultimo   = ultimo;
                this.ultimos4 = ultimos4;
            } else {
                // Es otro dia 
                this.guardarDB();
            }
        } catch (error) {
            console.error('Error al inicializar el controlador de tickets:', error);
        }
        
    
    }

    guardarDB() {
        try {

            const dbPath = path.join( __dirname, '../db/data.json');
            fs.writeFileSync(dbPath, JSON.stringify( this.toJson ) );
            console.log('Los datos se guardaron exitosamente en la base de datos');
        } catch ( error ) {

            console.error('Error al guardar en la base de datos:', error);

        }
    }

    siguiente() {

        this.ultimo += 1;
        const ticket = new Ticket( this.ultimo, null );
        this.tickets.push( ticket );

        this.guardarDB();

        return 'Ticket ' + ticket.numero;

    }


    atenderTicket( escritorio ) {

        // NO tenemos tickets
        if( this.tickets.length === 0 ) return null;

        const ticket = this.tickets[0];  // Extraer tickets
        this.tickets.shift();

        // Ticket que se necesita atender
        ticket.escritorio = escritorio;
        
        this.ultimos4.unshift( ticket );

        if( this.ultimos4.length > 4 ) {
            this.ultimos4.splice(-1,1);
        } 
        
        this.guardarDB();

        return ticket;
    }
}


module.exports = TicketControl;