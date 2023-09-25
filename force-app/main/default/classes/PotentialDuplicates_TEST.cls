@IsTest(IsParallel=false)
private with sharing class PotentialDuplicates_TEST {

    @IsTest
    private static void shouldReturnNullWhenNoDuplicatesAreFound() {
        Id recordId = UTIL_UnitTestData_TEST.mockId(Contact.getSObjectType());
        Map<String, Object> data = PotentialDuplicates.getDuplicates(recordId);
        System.assertEquals('', data.get('setOfMatches'),
            'There should be no duplicates');
    }

    @IsTest
    private static void shouldReturnIdsWhenDuplicatesAreFound() {
        List<Contact> contactList = UTIL_UnitTestData_TEST.getContacts(3);
        for(Contact c : contactList) {
            c.FirstName = 'Test';
            c.LastName = 'LastName';
            c.Email = 'tester@example.com';
        }
        insert contactList;

        Map<String, Object> data = PotentialDuplicates.getDuplicates(contactList[0].Id);
        String setOfMatches = (String)data.get('setOfMatches');
        System.assertNotEquals('', setOfMatches, 'Duplicate Ids should be returned');
        Integer numberOfMatches = setOfMatches.split(',').size();
        System.assertEquals(2, numberOfMatches, 'There should be 2 duplicates returned');
    }
}