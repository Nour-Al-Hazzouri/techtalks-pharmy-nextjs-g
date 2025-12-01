# System Requirements

## 1. Functional Requirements

### For End Users (Patients)
- **Medicine Search:** Search for medicines by name  
- **Nearby Pharmacy Display:** Locate nearby pharmacies that have the medicine in stock  
- **Map Integration:** Integrate Google Maps or Maphox  
- **Availability Status:** View “Available / Not Available”  
- **Report Inaccuracy:** Report incorrect or outdated information  

### For Pharmacy Users
- **Pharmacy Dashboard:** Simple interface for stock management  
- **Manual Stock Update:** Toggle “Available / Not Available”  
- **CSV/Excel Bulk Upload:** Upload inventory data from PMS  
- **Medicine Management:** Manage 20–30 critical shortage-prone medicines  

### For Administrators
- **Verification System:** Approve new pharmacy registrations  
- **License Verification:** Match license numbers with MOPH/OPL records  
- **Document Review:** Verify official pharmacy documents  
- **Verification Badges:** Assign “Verified” status to trusted pharmacies  

---

## 2. Non-Functional Requirements

### Performance & Responsiveness
- **Fast Response Times:** Results load in under 3 seconds  
- **High Availability:** 99% uptime, fault-tolerant  

### Security
- **Multi-level Authentication:** Separate login systems (users, pharmacies, admins)  
- **Data Protection:** Encrypt sensitive and personal data  

### Usability
- **Simple UI:** Intuitive and clean interface  
- **Smooth UX:** Seamless navigation  

---

## 3. Data Requirements

### Medicine Database
- **Content:** Official drug names and categorization  
- **Scope:** Focus on commonly needed or shortage-affected medicines  

### Credibility System
- **Timestamps:** Track each availability update  
- **Change Logging:** History of modifications  
- **Trust Indicators:** Display pharmacy verification status  

---

## 4. Integration Requirements

### Maps & Location
- **Map Service:** Integrate Google Maps or Maphox  
- **Location Services:** Use GPS to detect user location  

---

## 5. Deployment Requirements

### Technical Environment
- **Frontend:** Next.js + TypeScript, shadcn/ui  
- **Backend:** Laravel  
- **Database:** PostgreSQL  
- **Package Manager:** pnpm  
- **Task Manager:** Jira  
- **Testing:** Postman  

---

## 6. System Constraints
1. Basic medicine name search  
2. Pharmacy locations with availability status on maps  
3. Multi-level authentication  
4. Pharmacy dashboard (manual updates)  
5. Admin verification system  
6. Credibility indicators (timestamps, verification badges)  

---

## Post-MVP Features
- Barcode scanning  
- Price comparison  
- Alternative medicine recommendations  
- Advanced analytics (AI regression)  
- Mobile app  
