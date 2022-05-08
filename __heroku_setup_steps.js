/* 
=====================================================================================================
One time for the PC
=====================================================================================================

1. create, verify, install heroku cli and user login via terminal command

=====================================================================================================
Each time for each project
=====================================================================================================
1. Terminal Command heroku create 
2. git add . commit and push to my own git repository
3. git push heroku main 
4. visit dashboard > project > settings > Reveal config vars 
5. copy and paste .env file key and values. 
6. Ensure mongodb atlas database network settings for all ip address 

###### Note : Ensure to run the below 4 commands after a single change 
------------------------------------------------------------------
git add . commit and push to my own git repository and then git push heroku main

***************Connect heroku server with client by running below code in client side****************
1. replace localhost URL with heroku project URL using CTRL+SHIFT+F in everywhere. 
2. npm run build
3.firebase deploy
 */