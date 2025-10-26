**NOTE: WE HAVE DONE THIS!**

Now we have to improve this calendar by doing these things as a senior does!

Follow this list:
1) Add frontend validation with proper error messages in italian
2) So add a proper error handling when submitting calendar modals
3) When clicking the single event open a modal with:
    - centered title based on the type of data of the calendar use these titles:
        - "Dettagli manutenzione"
        - "Dettagli check in"
        - "Dettagli check out"
        - "Dettagli segnalazione"
    - below the title show the name of the opened modal:
        - for "manutenzioni" show the "nome manutenzione"
        - for "check in" and "check out" show the "luogo" of their respective check in or checkout
        - for "segnalazione" show the "nome attività"
    - below show date start date with the following text "(bold) Inizio: data"
    - below again show the end date with the following text "(bold) Fine: data"
    - Below add three buttons in a row:
        - "Chiudi manutenzione/check in/check out/segnalazione" -> close the popup
        - "Elimina manutenzione/check in/check out/segnalazione" -> gives a delete request to the endpoint (create if not created)
        - "Modifica manutenzione/check in/check out/segnalazione" -> reopens the popup filling with existing data for that record

So do it, this section must be production ready with all this implementation, remaining API implementation and the remaining of CRUD operations.

    