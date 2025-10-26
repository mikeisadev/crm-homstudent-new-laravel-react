Now we have to deeply focus into the complete development of the "Documenti" tab.

We have to deeply develop and create the features of "Crea cartella" and "Aggiungi documento" buttons.

These features must be heavily secure, heavily production ready in its core.

What "Crea cartella" must do:
- create a folder for the assigned root folder for that client with the inserted name in the frontend
- add deep validation because you can't create folders with the same name
- show a spinner while doing this action of creating the folder

What "Aggiungi documento" must do:
- let you uplopad "pdf, doc, docx, jpg, png" files or images with maximum of 2.5 MB each. No other extension is allowed and no more than 2.5 MB document is allowed and give me a source of truth to define those limitations.
- Show a spinner while uploading those files

Key core features:
- when adding an client a private folder for that client must be created with UUID4 reference to make sure that folder can only be accessed by that customer
- find the most secure, maintainable and production ready way to do that client-private client folder assignment
- when creating a new folder that must be created inside the space folder of that client which space is private and defined by a unique id (uuiv4)
- when clicking to a file I must be redirected to another tab where i can view that document inside default file/image viewer of the browser
- when clicking on top of a folder open that folder inside the UI/UX and show the inner files
- develop the UI/UX inside the tab you've created for the client in "Documenti" and don't be too complex, the interface must remain simple
- develop a solid uploading system API/SYSTEM with laravel libraries and security is number one priority. And find the best and simple folder structure to be defined and added to manage files and uploads in laravel
- I know that you'll tell me this but yes: ONLY IN THE FUTURE, NOT NOW, WE'LL IMPLEMENT THE UPLOAD ON THE CLOUD. PROMISED.

Let's develop this part like a senior developer!

Suggest me even more features (or add those here) and other security features to add to harden this feature.

At the end of this feature development add a checkpoint of all the things done inside this file, thanks.