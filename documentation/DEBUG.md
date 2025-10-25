# Debug this application: Laravel command approach
Do you get an error while running php artisan serve? Like a 500 error?

The first step is analyzing the log file inside "storage/logs/laravel.log".
 
If you get: **"No application encryption key has been specified"** that is throwing a 500 server error, or similar errors related to already set options and configuration the root cause can be a stale configuration cache.

So you can try running these commands to clean the cache:
- `php artisan config:clear`
- `php artisan cache:clear`
- `php artisan config:cache`

Now try accessing your application again with `php artisan serve`: after this the 500 error should be resolved!

# Permissions related errors
If errors keep persisting you can also try to double-check the file permissions of .env file or other important PHP config files.

This because sometimes permission settings can be forgotten and you have to give a check!.