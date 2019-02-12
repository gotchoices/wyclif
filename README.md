## Wyclif: WyattERP Component Layer InterFace server

WyattERP consists of a set of tools for building Enterprise Resource Planning 
software.  This just means tools for running your business like accounting, 
contact management, billing, payroll and so forth.

The idea behind WyattERP is to be able to generate applications very quickly
by just defining your operating parameters in a data dictionary.  Then the apps
essentially build themselves on the fly as users configure their screen to 
access the various tables and views you have defined.

WyCLIf is the Control Layer Interface.  This means it is a server process where
the front end, or GUI interacts.  It also contains a https server to deliver 
the application itself (Single Page Application, or SPI) to the user's browser.
Then, that SPI connects via a web socket on a different port (and possibly a
different server) to interact with the control and model layers.

This is an example server.  In an actual production deployment, your ERP may
a custom server that does more than this one.  But your server can call the
functionality of this basic template, and then add the additional services on.

## WyattERP Components:

Wylib:
-   UI components, implemented in Vue.js
-   JS modules to support the UI
-   UI portal to Wyseman socket to access data dictionary and control layer

Wyseman:
-   CLI: Schema authoring and deployment, schema version control
-   Socket handler: query builder, action launcher
-   Report lookup if a dispatcher and lookup table is provided

Wyselib:
-   Chunks of schema and data dictionary definitions
-   Macros and support functions for building the schema
-   Typically a subset of your eventual complete site schema
-   gnucash importer to run with the reference schema

Wyclif:
-   SPI server: Can also be invoked from your production server
-   Includes /clientinfo ajax server needed for authorization/login
-   Server support routines, can be called independently
-   Report dispatcher for associated actions described in data dictionary
-   report-bundle
-   wysegi-bundle
-   wyatt-bundle: generic ERP app, gnucash replacement
