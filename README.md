## Wyclif: WyattERP Component Layer InterFace server

WyattERP consists of a set of tools for building Enterprise Resource Planning 
software.  This just means tools for running a business like accounting, 
contact management, billing, payroll and so forth.

The intent is to be able to generate applications quickly by defining
operating parameters in a data dictionary.  Then applications can
essentially build themselves on the fly as users configure their screen to 
access the various tables and views you have defined.

WyCLIf implements the Control Layer Interface.  This means it is a server-side
process through which the front end, or GUI interacts.  It also contains a https 
server to deliver the application itself (Single Page Application, or SPA) to the 
user's browser.  Then, that SPA connects via a web socket on a different port 
(and possibly a different server) to interact with the control and model layers.

This is an example server.  In an actual production deployment, your ERP may be
a custom server that does more than this one.  But your server can call the
functionality of this basic template, and then add additional services.

### WyattERP Components

Wylib:
-   Browser UI components, implemented in Vue.js
-   JS modules to support the UI
-   UI portal to Wyseman socket to access data dictionary and control layer

Wyseman:
-   CLI: Schema authoring and deployment, schema version control
-   User connection handler: query builder, action launcher
-   Provides API for user applications whether web or mobile
-   Calls Wyclif dispatcher for actions not defined in the database

Wyselib:
-   Chunks of schema and data dictionary definitions
-   Macros and support functions for building schemas
-   Typically a subset of your eventual complete site schema
-   gnucash importer to run with the reference schema

Wyclif:
-   SPA server: Can also be invoked from your production server
-   Includes /clientinfo server consulted during authorization/login
-   Server support routines, can be called independently
-   Report dispatcher for custom actions and reports
-   report-bundle
-   wysegi-bundle
-   wyatt-bundle: generic ERP app (not yet implemented)

### Control Layer Function
A user interface connects to the control layer via websocket to the
Wyseman module.  Much of the API is sipmly SQL commands encoded into
a JSON structure.  For such commands, Wyseman simply decodes the SQL,
builds a query and sends it to the database.  Results are returned to
the user process marked with the same unique identifier the application
sent with the originating query.

In addition to regular SQL queries, the user process can send actions.
An action invokes a report or function implemented in the control layer.
It is much like a query, except it can do much more complex things.
For example, it might build a PDF report or set up a live html page
the user can interact with.  It can really do anything or return anything
the app may be prepared to deal with.

Because Wyselib may supply certain basic parts of a schema, it may also
supply certain action handlers.  A production ERP system will likely
also have a number of action handlers it will supply.  All these
handlers get registered into a structure and supplied to a dispatcher.
When actions come from the UI, the dispatcher can look them up and
determine which function is responsible for handling the requested
action.
