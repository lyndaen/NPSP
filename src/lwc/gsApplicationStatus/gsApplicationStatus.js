import { LightningElement, track, wire } from 'lwc';
import Resources from '@salesforce/resourceUrl/CumulusStaticResources'
import getApplicationStatus from '@salesforce/apex/GS_ApplicationStatusController.getApplicationStatus'
import gsNoApplicationSubmitted from '@salesforce/label/c.gsNoApplicationSubmitted'
import gsLearnMore from '@salesforce/label/c.gsLearnMore'
import gsDaysRemainingInFreeTrial from '@salesforce/label/c.gsDaysRemainingInFreeTrial'
import gsApplyForFreeLicenses from '@salesforce/label/c.gsApplyForFreeLicenses'
import gsApplicationStatus from '@salesforce/label/c.gsApplicationStatus'
import gsSubmitted from '@salesforce/label/c.gsSubmitted'
import gsDaysAdded from '@salesforce/label/c.gsDaysAdded'
import gsCheckStatus from '@salesforce/label/c.gsCheckStatus'
import gsApplicationStatusModalHeader from '@salesforce/label/c.gsApplicationStatusModalHeader'
import gsClose from '@salesforce/label/c.gsClose'
import gsFollowUpApplicationStatus from '@salesforce/label/c.gsFollowUpApplicationStatus'
import gsEmailAddress from '@salesforce/label/c.gsEmailAddress'
export default class GsApplicationStatus extends LightningElement {
    
    @track errorMessage = "";
    @track diffInDays = null;
    @track isApplicationSubmitted = false;
    @track isLoading = false;
    @track img = "";
    @track isActiveInstance = false;
    applyForFreeLicensesImg = Resources + '/gsResources/Accept_Tasks_Apply_Card.png';
    checkForStatusImg = Resources + '/gsResources/gift_illustration_2.svg';

    labels = {
        gsNoApplicationSubmitted,
        gsLearnMore,
        gsDaysRemainingInFreeTrial,
        gsApplyForFreeLicenses,
        gsApplicationStatus,
        gsSubmitted,
        gsDaysAdded,
        gsCheckStatus,
        gsApplicationStatusModalHeader,
        gsClose,
        gsFollowUpApplicationStatus,
        gsEmailAddress
    }

    constructor () {
        super();
        this.template.addEventListener('dialogclose', evt => {
            alert('hola');
        });
    }
    /**
     * Initialized the component with the data retrieved from Salesforce
     */
    connectedCallback() {
        this.showSpinner();

        getApplicationStatus()
        .then(result => {
            this.diffInDays = this.calculateTrialRemainingDays(result);
            this.isApplicationSubmitted = this.checkApplicationSubmitted(result);
            this.img = this.isApplicationSubmitted ?  this.checkForStatusImg : this.applyForFreeLicensesImg; 
            this.isActiveInstance = result.trialExpirationDate == null;
            this.hideSpinner();
        })
        .catch(error => {
            this.errorMessage = error;
            this.hideSpinner();
        });
    }

    /**
     * Shows the spinner in the component
     */
    showSpinner() {
        this.isLoading = true;
    }

    /**
     * Hides the spinner in the component
     */
    hideSpinner() {
        this.isLoading = false;
    }

    /**
     * 
     * @param {Object} result - Retrieved result object from Salesforce, in order to this to work it has to have a 'trialExpirationDate' field.
     * @returns remaining days between today and expiration day or -1.
     */
    calculateTrialRemainingDays(result) {
        if (result.trialExpirationDate) {
            const date = new Date(result.trialExpirationDate);
            const oneDay = 24 * 60 * 60 * 1000;
            const today = new Date();
            return Math.ceil(Math.abs(date - today)/oneDay);
        }
        return -1;
    }

    /**
     * Check if application has been submitted, using data from Salesforce org.
     * @param {Object} result the data retrieved from salesforce
     * @returns True if data has an applicationDate field, false otherwise.
     */
    checkApplicationSubmitted(result) {
        return result.applicationDate !== undefined && result.applicationDate !== null;
    }

    /**
     * Event handler for clicking in the CheckStatus button displayed when a application is submitted.
     * In this iteration is showing a pop up with an email address to ask it
     */
    onCheckStatusClick() {
        this.template.querySelector("c-modal").show();
    }

    onClickCloseModal() {
        this.template.querySelector("c-modal").hide();
    }

    handleModalClose() {
        this.template.querySelector("button").focus();
    }
}