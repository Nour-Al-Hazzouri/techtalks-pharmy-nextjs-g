<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicineSeeder extends Seeder
{
    /**
     * Seed the medicines table with 100+ common medicines.
     */
    public function run(): void
    {
        $medicines = [
            // Pain Relief & Fever (15)
            ['name' => 'Paracetamol', 'generic_name' => 'Acetaminophen', 'category' => 'Pain Relief', 'description' => 'Used for pain relief and fever reduction'],
            ['name' => 'Ibuprofen', 'generic_name' => 'Ibuprofen', 'category' => 'Pain Relief', 'description' => 'Anti-inflammatory pain reliever'],
            ['name' => 'Aspirin', 'generic_name' => 'Acetylsalicylic Acid', 'category' => 'Pain Relief', 'description' => 'Pain reliever and blood thinner'],
            ['name' => 'Naproxen', 'generic_name' => 'Naproxen Sodium', 'category' => 'Pain Relief', 'description' => 'NSAID for pain and inflammation'],
            ['name' => 'Diclofenac', 'generic_name' => 'Diclofenac Sodium', 'category' => 'Pain Relief', 'description' => 'Anti-inflammatory for arthritis and pain'],
            ['name' => 'Tramadol', 'generic_name' => 'Tramadol HCl', 'category' => 'Pain Relief', 'description' => 'Moderate to severe pain relief'],
            ['name' => 'Celecoxib', 'generic_name' => 'Celecoxib', 'category' => 'Pain Relief', 'description' => 'COX-2 inhibitor for arthritis'],
            ['name' => 'Mefenamic Acid', 'generic_name' => 'Mefenamic Acid', 'category' => 'Pain Relief', 'description' => 'NSAID for menstrual pain'],
            ['name' => 'Ketorolac', 'generic_name' => 'Ketorolac Tromethamine', 'category' => 'Pain Relief', 'description' => 'Short-term severe pain management'],
            ['name' => 'Piroxicam', 'generic_name' => 'Piroxicam', 'category' => 'Pain Relief', 'description' => 'NSAID for osteoarthritis'],
            ['name' => 'Meloxicam', 'generic_name' => 'Meloxicam', 'category' => 'Pain Relief', 'description' => 'Arthritis pain relief'],
            ['name' => 'Indomethacin', 'generic_name' => 'Indomethacin', 'category' => 'Pain Relief', 'description' => 'NSAID for gout and arthritis'],
            ['name' => 'Etoricoxib', 'generic_name' => 'Etoricoxib', 'category' => 'Pain Relief', 'description' => 'COX-2 inhibitor for chronic pain'],
            ['name' => 'Panadol Extra', 'generic_name' => 'Paracetamol + Caffeine', 'category' => 'Pain Relief', 'description' => 'Enhanced pain relief formula'],
            ['name' => 'Brufen', 'generic_name' => 'Ibuprofen', 'category' => 'Pain Relief', 'description' => 'Brand name ibuprofen for pain'],

            // Antibiotics (20)
            ['name' => 'Amoxicillin', 'generic_name' => 'Amoxicillin', 'category' => 'Antibiotics', 'description' => 'Broad-spectrum penicillin antibiotic'],
            ['name' => 'Azithromycin', 'generic_name' => 'Azithromycin', 'category' => 'Antibiotics', 'description' => 'Macrolide antibiotic for respiratory infections'],
            ['name' => 'Ciprofloxacin', 'generic_name' => 'Ciprofloxacin', 'category' => 'Antibiotics', 'description' => 'Fluoroquinolone for UTI and respiratory'],
            ['name' => 'Metronidazole', 'generic_name' => 'Metronidazole', 'category' => 'Antibiotics', 'description' => 'Antibiotic for anaerobic bacterial infections'],
            ['name' => 'Doxycycline', 'generic_name' => 'Doxycycline Hyclate', 'category' => 'Antibiotics', 'description' => 'Tetracycline antibiotic for various infections'],
            ['name' => 'Cephalexin', 'generic_name' => 'Cephalexin', 'category' => 'Antibiotics', 'description' => 'Cephalosporin antibiotic for skin infections'],
            ['name' => 'Clarithromycin', 'generic_name' => 'Clarithromycin', 'category' => 'Antibiotics', 'description' => 'Macrolide for respiratory tract infections'],
            ['name' => 'Levofloxacin', 'generic_name' => 'Levofloxacin', 'category' => 'Antibiotics', 'description' => 'Fluoroquinolone for pneumonia'],
            ['name' => 'Cefixime', 'generic_name' => 'Cefixime', 'category' => 'Antibiotics', 'description' => 'Oral cephalosporin antibiotic'],
            ['name' => 'Clindamycin', 'generic_name' => 'Clindamycin', 'category' => 'Antibiotics', 'description' => 'Lincosamide for serious infections'],
            ['name' => 'Augmentin', 'generic_name' => 'Amoxicillin + Clavulanate', 'category' => 'Antibiotics', 'description' => 'Combination antibiotic for resistant bacteria'],
            ['name' => 'Erythromycin', 'generic_name' => 'Erythromycin', 'category' => 'Antibiotics', 'description' => 'Macrolide for penicillin-allergic patients'],
            ['name' => 'Trimethoprim', 'generic_name' => 'Trimethoprim', 'category' => 'Antibiotics', 'description' => 'UTI treatment antibiotic'],
            ['name' => 'Nitrofurantoin', 'generic_name' => 'Nitrofurantoin', 'category' => 'Antibiotics', 'description' => 'Urinary tract infection treatment'],
            ['name' => 'Ceftriaxone', 'generic_name' => 'Ceftriaxone Sodium', 'category' => 'Antibiotics', 'description' => 'Injectable cephalosporin'],
            ['name' => 'Penicillin V', 'generic_name' => 'Phenoxymethylpenicillin', 'category' => 'Antibiotics', 'description' => 'Oral penicillin antibiotic'],
            ['name' => 'Norfloxacin', 'generic_name' => 'Norfloxacin', 'category' => 'Antibiotics', 'description' => 'Fluoroquinolone for UTI'],
            ['name' => 'Ofloxacin', 'generic_name' => 'Ofloxacin', 'category' => 'Antibiotics', 'description' => 'Broad-spectrum fluoroquinolone'],
            ['name' => 'Tetracycline', 'generic_name' => 'Tetracycline HCl', 'category' => 'Antibiotics', 'description' => 'Broad-spectrum tetracycline antibiotic'],
            ['name' => 'Gentamicin', 'generic_name' => 'Gentamicin Sulfate', 'category' => 'Antibiotics', 'description' => 'Aminoglycoside for serious infections'],

            // Cardiovascular (15)
            ['name' => 'Lisinopril', 'generic_name' => 'Lisinopril', 'category' => 'Cardiovascular', 'description' => 'ACE inhibitor for hypertension'],
            ['name' => 'Amlodipine', 'generic_name' => 'Amlodipine Besylate', 'category' => 'Cardiovascular', 'description' => 'Calcium channel blocker for blood pressure'],
            ['name' => 'Atorvastatin', 'generic_name' => 'Atorvastatin Calcium', 'category' => 'Cardiovascular', 'description' => 'Statin for cholesterol management'],
            ['name' => 'Metoprolol', 'generic_name' => 'Metoprolol Tartrate', 'category' => 'Cardiovascular', 'description' => 'Beta-blocker for heart conditions'],
            ['name' => 'Losartan', 'generic_name' => 'Losartan Potassium', 'category' => 'Cardiovascular', 'description' => 'ARB for hypertension'],
            ['name' => 'Simvastatin', 'generic_name' => 'Simvastatin', 'category' => 'Cardiovascular', 'description' => 'Cholesterol-lowering statin'],
            ['name' => 'Clopidogrel', 'generic_name' => 'Clopidogrel Bisulfate', 'category' => 'Cardiovascular', 'description' => 'Blood thinner to prevent clots'],
            ['name' => 'Hydrochlorothiazide', 'generic_name' => 'Hydrochlorothiazide', 'category' => 'Cardiovascular', 'description' => 'Diuretic for hypertension'],
            ['name' => 'Furosemide', 'generic_name' => 'Furosemide', 'category' => 'Cardiovascular', 'description' => 'Loop diuretic for fluid retention'],
            ['name' => 'Warfarin', 'generic_name' => 'Warfarin Sodium', 'category' => 'Cardiovascular', 'description' => 'Anticoagulant for blood clot prevention'],
            ['name' => 'Enalapril', 'generic_name' => 'Enalapril Maleate', 'category' => 'Cardiovascular', 'description' => 'ACE inhibitor for heart failure'],
            ['name' => 'Valsartan', 'generic_name' => 'Valsartan', 'category' => 'Cardiovascular', 'description' => 'ARB for high blood pressure'],
            ['name' => 'Carvedilol', 'generic_name' => 'Carvedilol', 'category' => 'Cardiovascular', 'description' => 'Beta-blocker for heart failure'],
            ['name' => 'Digoxin', 'generic_name' => 'Digoxin', 'category' => 'Cardiovascular', 'description' => 'Heart failure and arrhythmia treatment'],
            ['name' => 'Rosuvastatin', 'generic_name' => 'Rosuvastatin Calcium', 'category' => 'Cardiovascular', 'description' => 'High-potency statin'],

            // Diabetes (12)
            ['name' => 'Metformin', 'generic_name' => 'Metformin HCl', 'category' => 'Diabetes', 'description' => 'First-line diabetes medication'],
            ['name' => 'Glibenclamide', 'generic_name' => 'Glyburide', 'category' => 'Diabetes', 'description' => 'Sulfonylurea for type 2 diabetes'],
            ['name' => 'Glimepiride', 'generic_name' => 'Glimepiride', 'category' => 'Diabetes', 'description' => 'Sulfonylurea for blood sugar control'],
            ['name' => 'Insulin Glargine', 'generic_name' => 'Insulin Glargine', 'category' => 'Diabetes', 'description' => 'Long-acting insulin'],
            ['name' => 'Insulin Lispro', 'generic_name' => 'Insulin Lispro', 'category' => 'Diabetes', 'description' => 'Rapid-acting insulin'],
            ['name' => 'Sitagliptin', 'generic_name' => 'Sitagliptin Phosphate', 'category' => 'Diabetes', 'description' => 'DPP-4 inhibitor for diabetes'],
            ['name' => 'Empagliflozin', 'generic_name' => 'Empagliflozin', 'category' => 'Diabetes', 'description' => 'SGLT2 inhibitor for diabetes'],
            ['name' => 'Pioglitazone', 'generic_name' => 'Pioglitazone HCl', 'category' => 'Diabetes', 'description' => 'Thiazolidinedione for insulin sensitivity'],
            ['name' => 'Gliclazide', 'generic_name' => 'Gliclazide', 'category' => 'Diabetes', 'description' => 'Sulfonylurea for type 2 diabetes'],
            ['name' => 'Glucophage', 'generic_name' => 'Metformin HCl', 'category' => 'Diabetes', 'description' => 'Brand name metformin'],
            ['name' => 'Dapagliflozin', 'generic_name' => 'Dapagliflozin', 'category' => 'Diabetes', 'description' => 'SGLT2 inhibitor'],
            ['name' => 'Vildagliptin', 'generic_name' => 'Vildagliptin', 'category' => 'Diabetes', 'description' => 'DPP-4 inhibitor'],

            // Respiratory (12)
            ['name' => 'Salbutamol', 'generic_name' => 'Albuterol', 'category' => 'Respiratory', 'description' => 'Bronchodilator for asthma'],
            ['name' => 'Montelukast', 'generic_name' => 'Montelukast Sodium', 'category' => 'Respiratory', 'description' => 'Leukotriene inhibitor for asthma'],
            ['name' => 'Fluticasone', 'generic_name' => 'Fluticasone Propionate', 'category' => 'Respiratory', 'description' => 'Inhaled corticosteroid for asthma'],
            ['name' => 'Budesonide', 'generic_name' => 'Budesonide', 'category' => 'Respiratory', 'description' => 'Inhaled steroid for COPD'],
            ['name' => 'Salmeterol', 'generic_name' => 'Salmeterol Xinafoate', 'category' => 'Respiratory', 'description' => 'Long-acting bronchodilator'],
            ['name' => 'Tiotropium', 'generic_name' => 'Tiotropium Bromide', 'category' => 'Respiratory', 'description' => 'Anticholinergic for COPD'],
            ['name' => 'Theophylline', 'generic_name' => 'Theophylline', 'category' => 'Respiratory', 'description' => 'Bronchodilator for asthma/COPD'],
            ['name' => 'Bromhexine', 'generic_name' => 'Bromhexine HCl', 'category' => 'Respiratory', 'description' => 'Mucolytic for cough'],
            ['name' => 'Ambroxol', 'generic_name' => 'Ambroxol HCl', 'category' => 'Respiratory', 'description' => 'Expectorant for respiratory conditions'],
            ['name' => 'Dextromethorphan', 'generic_name' => 'Dextromethorphan HBr', 'category' => 'Respiratory', 'description' => 'Cough suppressant'],
            ['name' => 'Guaifenesin', 'generic_name' => 'Guaifenesin', 'category' => 'Respiratory', 'description' => 'Expectorant for chest congestion'],
            ['name' => 'Pseudoephedrine', 'generic_name' => 'Pseudoephedrine HCl', 'category' => 'Respiratory', 'description' => 'Nasal decongestant'],

            // Gastrointestinal (15)
            ['name' => 'Omeprazole', 'generic_name' => 'Omeprazole', 'category' => 'Gastrointestinal', 'description' => 'Proton pump inhibitor for acid reflux'],
            ['name' => 'Pantoprazole', 'generic_name' => 'Pantoprazole Sodium', 'category' => 'Gastrointestinal', 'description' => 'PPI for GERD'],
            ['name' => 'Esomeprazole', 'generic_name' => 'Esomeprazole Magnesium', 'category' => 'Gastrointestinal', 'description' => 'PPI for stomach acid'],
            ['name' => 'Ranitidine', 'generic_name' => 'Ranitidine HCl', 'category' => 'Gastrointestinal', 'description' => 'H2 blocker for heartburn'],
            ['name' => 'Famotidine', 'generic_name' => 'Famotidine', 'category' => 'Gastrointestinal', 'description' => 'H2 blocker for acid reduction'],
            ['name' => 'Domperidone', 'generic_name' => 'Domperidone', 'category' => 'Gastrointestinal', 'description' => 'Anti-nausea medication'],
            ['name' => 'Metoclopramide', 'generic_name' => 'Metoclopramide HCl', 'category' => 'Gastrointestinal', 'description' => 'Gastric motility agent'],
            ['name' => 'Ondansetron', 'generic_name' => 'Ondansetron', 'category' => 'Gastrointestinal', 'description' => 'Anti-emetic for nausea'],
            ['name' => 'Loperamide', 'generic_name' => 'Loperamide HCl', 'category' => 'Gastrointestinal', 'description' => 'Anti-diarrheal medication'],
            ['name' => 'Lactulose', 'generic_name' => 'Lactulose', 'category' => 'Gastrointestinal', 'description' => 'Laxative for constipation'],
            ['name' => 'Bisacodyl', 'generic_name' => 'Bisacodyl', 'category' => 'Gastrointestinal', 'description' => 'Stimulant laxative'],
            ['name' => 'Antacid', 'generic_name' => 'Aluminum/Magnesium Hydroxide', 'category' => 'Gastrointestinal', 'description' => 'Acid neutralizer'],
            ['name' => 'Sucralfate', 'generic_name' => 'Sucralfate', 'category' => 'Gastrointestinal', 'description' => 'Ulcer coating agent'],
            ['name' => 'Lansoprazole', 'generic_name' => 'Lansoprazole', 'category' => 'Gastrointestinal', 'description' => 'PPI for ulcer healing'],
            ['name' => 'Rabeprazole', 'generic_name' => 'Rabeprazole Sodium', 'category' => 'Gastrointestinal', 'description' => 'PPI for GERD treatment'],

            // Allergy & Antihistamines (10)
            ['name' => 'Cetirizine', 'generic_name' => 'Cetirizine HCl', 'category' => 'Allergy', 'description' => 'Non-drowsy antihistamine'],
            ['name' => 'Loratadine', 'generic_name' => 'Loratadine', 'category' => 'Allergy', 'description' => 'Non-sedating antihistamine'],
            ['name' => 'Fexofenadine', 'generic_name' => 'Fexofenadine HCl', 'category' => 'Allergy', 'description' => 'Antihistamine for allergies'],
            ['name' => 'Diphenhydramine', 'generic_name' => 'Diphenhydramine HCl', 'category' => 'Allergy', 'description' => 'First-gen antihistamine'],
            ['name' => 'Chlorpheniramine', 'generic_name' => 'Chlorpheniramine Maleate', 'category' => 'Allergy', 'description' => 'Antihistamine for cold symptoms'],
            ['name' => 'Desloratadine', 'generic_name' => 'Desloratadine', 'category' => 'Allergy', 'description' => 'Non-sedating allergy relief'],
            ['name' => 'Levocetirizine', 'generic_name' => 'Levocetirizine Dihydrochloride', 'category' => 'Allergy', 'description' => 'Potent antihistamine'],
            ['name' => 'Hydroxyzine', 'generic_name' => 'Hydroxyzine HCl', 'category' => 'Allergy', 'description' => 'Antihistamine with sedative effect'],
            ['name' => 'Promethazine', 'generic_name' => 'Promethazine HCl', 'category' => 'Allergy', 'description' => 'Antihistamine for allergic reactions'],
            ['name' => 'Bilastine', 'generic_name' => 'Bilastine', 'category' => 'Allergy', 'description' => 'New-generation antihistamine'],

            // Vitamins & Supplements (15)
            ['name' => 'Vitamin C', 'generic_name' => 'Ascorbic Acid', 'category' => 'Vitamins', 'description' => 'Immune system support'],
            ['name' => 'Vitamin D3', 'generic_name' => 'Cholecalciferol', 'category' => 'Vitamins', 'description' => 'Bone health and immunity'],
            ['name' => 'Vitamin B12', 'generic_name' => 'Cyanocobalamin', 'category' => 'Vitamins', 'description' => 'Energy and nerve function'],
            ['name' => 'Vitamin B Complex', 'generic_name' => 'B Vitamins', 'category' => 'Vitamins', 'description' => 'Energy metabolism support'],
            ['name' => 'Iron Supplement', 'generic_name' => 'Ferrous Sulfate', 'category' => 'Vitamins', 'description' => 'Iron deficiency treatment'],
            ['name' => 'Calcium + Vitamin D', 'generic_name' => 'Calcium Carbonate + D3', 'category' => 'Vitamins', 'description' => 'Bone health supplement'],
            ['name' => 'Folic Acid', 'generic_name' => 'Folic Acid', 'category' => 'Vitamins', 'description' => 'Prenatal vitamin for development'],
            ['name' => 'Zinc Supplement', 'generic_name' => 'Zinc Sulfate', 'category' => 'Vitamins', 'description' => 'Immune support and wound healing'],
            ['name' => 'Multivitamin', 'generic_name' => 'Multivitamin Complex', 'category' => 'Vitamins', 'description' => 'Daily nutritional supplement'],
            ['name' => 'Omega-3 Fish Oil', 'generic_name' => 'EPA/DHA', 'category' => 'Vitamins', 'description' => 'Heart and brain health'],
            ['name' => 'Magnesium', 'generic_name' => 'Magnesium Oxide', 'category' => 'Vitamins', 'description' => 'Muscle and nerve function'],
            ['name' => 'Vitamin E', 'generic_name' => 'Tocopherol', 'category' => 'Vitamins', 'description' => 'Antioxidant vitamin'],
            ['name' => 'Vitamin A', 'generic_name' => 'Retinol', 'category' => 'Vitamins', 'description' => 'Vision and skin health'],
            ['name' => 'Potassium', 'generic_name' => 'Potassium Chloride', 'category' => 'Vitamins', 'description' => 'Electrolyte supplement'],
            ['name' => 'Vitamin K', 'generic_name' => 'Phytonadione', 'category' => 'Vitamins', 'description' => 'Blood clotting vitamin'],

            // Mental Health & Nervous System (10)
            ['name' => 'Sertraline', 'generic_name' => 'Sertraline HCl', 'category' => 'Mental Health', 'description' => 'SSRI antidepressant'],
            ['name' => 'Fluoxetine', 'generic_name' => 'Fluoxetine HCl', 'category' => 'Mental Health', 'description' => 'SSRI for depression and anxiety'],
            ['name' => 'Escitalopram', 'generic_name' => 'Escitalopram Oxalate', 'category' => 'Mental Health', 'description' => 'SSRI for depression'],
            ['name' => 'Alprazolam', 'generic_name' => 'Alprazolam', 'category' => 'Mental Health', 'description' => 'Benzodiazepine for anxiety'],
            ['name' => 'Diazepam', 'generic_name' => 'Diazepam', 'category' => 'Mental Health', 'description' => 'Anxiolytic and muscle relaxant'],
            ['name' => 'Amitriptyline', 'generic_name' => 'Amitriptyline HCl', 'category' => 'Mental Health', 'description' => 'Tricyclic antidepressant'],
            ['name' => 'Gabapentin', 'generic_name' => 'Gabapentin', 'category' => 'Mental Health', 'description' => 'Anticonvulsant for nerve pain'],
            ['name' => 'Pregabalin', 'generic_name' => 'Pregabalin', 'category' => 'Mental Health', 'description' => 'Nerve pain and anxiety'],
            ['name' => 'Zolpidem', 'generic_name' => 'Zolpidem Tartrate', 'category' => 'Mental Health', 'description' => 'Sleep aid medication'],
            ['name' => 'Lorazepam', 'generic_name' => 'Lorazepam', 'category' => 'Mental Health', 'description' => 'Benzodiazepine for anxiety'],

            // Skin & Dermatology (6)
            ['name' => 'Hydrocortisone Cream', 'generic_name' => 'Hydrocortisone', 'category' => 'Dermatology', 'description' => 'Topical steroid for inflammation'],
            ['name' => 'Clotrimazole', 'generic_name' => 'Clotrimazole', 'category' => 'Dermatology', 'description' => 'Antifungal cream'],
            ['name' => 'Ketoconazole', 'generic_name' => 'Ketoconazole', 'category' => 'Dermatology', 'description' => 'Antifungal for skin infections'],
            ['name' => 'Mupirocin', 'generic_name' => 'Mupirocin', 'category' => 'Dermatology', 'description' => 'Topical antibiotic'],
            ['name' => 'Benzoyl Peroxide', 'generic_name' => 'Benzoyl Peroxide', 'category' => 'Dermatology', 'description' => 'Acne treatment'],
            ['name' => 'Tretinoin', 'generic_name' => 'Tretinoin', 'category' => 'Dermatology', 'description' => 'Retinoid for acne and wrinkles'],
        ];

        $now = now();

        foreach ($medicines as $medicine) {
            DB::table('medicines')->insert([
                'name' => $medicine['name'],
                'generic_name' => $medicine['generic_name'],
                'category' => $medicine['category'],
                'description' => $medicine['description'],
                'created_at' => $now,

            ]);
        }
    }
}
