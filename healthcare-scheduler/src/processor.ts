import { RawUser, RawPost, HealthcareWorker, SpecialtyKeywords } from './types';

export class DataProcessor {
  // Specialty mapping based on company name keywords
  private static specialtyKeywords: SpecialtyKeywords = {
    'health': 'Nurse',
    'care': 'Nurse', 
    'med': 'Doctor',
    'clinic': 'Doctor',
    'hospital': 'Doctor',
    'tech': 'Tech',
    'systems': 'Tech',
    'solutions': 'Tech',
    'group': 'Other',
    'inc': 'Other',
    'llc': 'Other',
  };

  /**
   * Determine specialty based on company name
   */
  private static determineSpecialty(companyName: string): 'Nurse' | 'Doctor' | 'Tech' | 'Other' {
    const name = companyName.toLowerCase();
    
    // Check for specialty keywords
    for (const [keyword, specialty] of Object.entries(this.specialtyKeywords)) {
      if (name.includes(keyword)) {
        return specialty;
      }
    }
    
    // Default specialty distribution based on company name hash
    const hash = this.hashString(name);
    const remainder = hash % 3;
    
    switch (remainder) {
      case 0: return 'Nurse';
      case 1: return 'Doctor'; 
      case 2: return 'Tech';
      default: return 'Other';
    }
  }

  /**
   * Simple hash function for consistent specialty assignment
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calculate availability based on certification count
   */
  private static calculateAvailability(certificationCount: number): 'available' | 'busy' | 'unavailable' {
    if (certificationCount > 5) return 'busy';
    if (certificationCount >= 3) return 'available';
    return 'unavailable';
  }

  /**
   * Generate hourly rate based on specialty and experience (cert count)
   */
  private static generateHourlyRate(specialty: string, certificationCount: number): number {
    let baseRate: number;
    let experienceMultiplier = 1 + (certificationCount * 0.1); // 10% per certification
    
    switch (specialty) {
      case 'Doctor':
        baseRate = 85 + Math.random() * 35; // $85-120
        break;
      case 'Nurse':
        baseRate = 35 + Math.random() * 10; // $35-45
        break;
      case 'Tech':
        baseRate = 25 + Math.random() * 10; // $25-35
        break;
      default:
        baseRate = 30 + Math.random() * 15; // $30-45
    }
    
    const finalRate = baseRate * experienceMultiplier;
    return Math.round(finalRate * 100) / 100; // Round to 2 decimals
  }

  /**
   * Count certifications (posts) per user
   */
  private static countCertifications(userId: number, posts: RawPost[]): number {
    return posts.filter(post => post.userId === userId).length;
  }

  /**
   * Transform raw user data into healthcare worker
   */
  private static transformUser(user: RawUser, posts: RawPost[]): HealthcareWorker {
    const certificationCount = this.countCertifications(user.id, posts);
    const specialty = this.determineSpecialty(user.company.name);
    const availability = this.calculateAvailability(certificationCount);
    const hourlyRate = this.generateHourlyRate(specialty, certificationCount);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      specialty,
      certificationCount,
      availability,
      hourlyRate,
    };
  }

  /**
   * Main processing function - transform all data
   */
  static processData(users: RawUser[], posts: RawPost[]): HealthcareWorker[] {
    console.log('🔄 Processing healthcare worker data...');
    
    const workers = users.map(user => this.transformUser(user, posts));
    
    console.log(`✅ Processed ${workers.length} healthcare workers`);
    
    // Log summary statistics
    const stats = this.generateStats(workers);
    console.log('\n📊 Processing Summary:');
    console.log(`   Nurses: ${stats.nurses} | Doctors: ${stats.doctors} | Techs: ${stats.techs} | Other: ${stats.other}`);
    console.log(`   Available: ${stats.available} | Busy: ${stats.busy} | Unavailable: ${stats.unavailable}`);
    
    return workers;
  }

  /**
   * Generate summary statistics
   */
  private static generateStats(workers: HealthcareWorker[]) {
    return {
      nurses: workers.filter(w => w.specialty === 'Nurse').length,
      doctors: workers.filter(w => w.specialty === 'Doctor').length,
      techs: workers.filter(w => w.specialty === 'Tech').length,
      other: workers.filter(w => w.specialty === 'Other').length,
      available: workers.filter(w => w.availability === 'available').length,
      busy: workers.filter(w => w.availability === 'busy').length,
      unavailable: workers.filter(w => w.availability === 'unavailable').length,
    };
  }

  /**
   * Generate formatted report
   */
  static generateReport(workers: HealthcareWorker[]): string {
    let report = '\n🏥 Healthcare Staff Report\n';
    report += '========================\n\n';

    const specialties = ['Doctor', 'Nurse', 'Tech', 'Other'] as const;
    const availabilities = ['available', 'busy', 'unavailable'] as const;

    for (const specialty of specialties) {
      for (const availability of availabilities) {
        const filtered = workers.filter(w => 
          w.specialty === specialty && w.availability === availability
        );

        if (filtered.length > 0) {
          const statusEmoji = availability === 'available' ? '✅' : 
                           availability === 'busy' ? '⏰' : '❌';
          
          report += `${statusEmoji} ${availability.toUpperCase()} ${specialty.toUpperCase()}S (${filtered.length}):\n`;
          
          filtered.forEach(worker => {
            report += `   • ${worker.name} (${worker.email}) - $${worker.hourlyRate}/hr - ${worker.certificationCount} certs\n`;
          });
          report += '\n';
        }
      }
    }

    return report;
  }
}