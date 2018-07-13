*** Settings ***

Resource        tests/NPSP.robot
Suite Setup     Open Test Browser
Suite Teardown  Delete Records and Close Browser

*** Test Cases ***

Create Relationships for contacts
    #1 contact HouseHold Validation
    ${contact_id1} =  Create Contact with Email
    &{contact1} =  Salesforce Get  Contact  ${contact_id1}
    Click Link                link= &{contact1}[LastName] Household
    
    #2 Create a new contact under HouseHold Validation
    ${contact_id2} =  New Contact for HouseHold
    &{contact2} =  Salesforce Get  Contact  ${contact_id2}
    Page Should Contain  &{contact1}[LastName] and &{contact2}[LastName] Household
    Scroll Page To Location    50    1000
    Click Related List Button  Relationships    New
    Populate Lookup Field    Related Contact    &{contact1}[FirstName] &{contact1}[LastName]
    Click Dropdown            Type
    Click link    link=Parent
    Click Modal Button        Save
    ${expected result}        Catenate    &{contact1}[FirstName] &{contact1}[LastName]    is    &{contact2}[FirstName] &{contact2}[LastName]'s    Parent
    Log to Console    ${expected result}
    ${id}    ${status}    Check Status    &{contact1}[FirstName] &{contact1}[LastName]
    Should Be Equal As Strings    ${status}    ${expected result}
    Sleep    5
    Click Link    link=Show more actions
    Click Link    link=Relationships Viewer
    Sleep    5 
    