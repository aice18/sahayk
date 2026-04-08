import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import styles from './InterestSelector.module.css';

interface Interest {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

interface InterestSelectorProps {
  interests: Interest[];
  selectedInterests: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  maxSelections?: number;
}

export const InterestSelector: React.FC<InterestSelectorProps> = ({
  interests,
  selectedInterests,
  onSelectionChange,
  maxSelections = 5
}) => {
  const { t } = useLanguage();
  const [localSelected, setLocalSelected] = useState<string[]>(selectedInterests);

  useEffect(() => {
    setLocalSelected(selectedInterests);
  }, [selectedInterests]);

  const toggleInterest = (interestId: string) => {
    if (localSelected.includes(interestId)) {
      const updated = localSelected.filter(id => id !== interestId);
      setLocalSelected(updated);
      onSelectionChange(updated);
    } else if (localSelected.length < maxSelections) {
      const updated = [...localSelected, interestId];
      setLocalSelected(updated);
      onSelectionChange(updated);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('onboarding.selectInterests') || 'Select Your Interests'}</h3>
        <p className={styles.subtitle}>
          {t('onboarding.selectInterestsDesc') || `Choose up to ${maxSelections} categories`}
        </p>
        <p className={styles.counter}>
          {localSelected.length} / {maxSelections} {t('common.selected') || 'selected'}
        </p>
      </div>

      <div className={styles.grid}>
        {interests.map((interest) => (
          <button
            key={interest.id}
            className={`${styles.card} ${
              localSelected.includes(interest.id) ? styles.selected : ''
            }`}
            onClick={() => toggleInterest(interest.id)}
            style={{
              borderColor: interest.color,
              backgroundColor: localSelected.includes(interest.id)
                ? `${interest.color}20`
                : 'transparent'
            }}
            title={interest.name}
          >
            <div className={styles.icon}>{interest.icon}</div>
            <div className={styles.name}>{interest.name}</div>
            {localSelected.includes(interest.id) && (
              <div className={styles.checkmark}>✓</div>
            )}
          </button>
        ))}
      </div>

      {localSelected.length === 0 && (
        <div className={styles.warning}>
          <p>{t('onboarding.selectAtLeastOne') || 'Please select at least one interest to continue'}</p>
        </div>
      )}
    </div>
  );
};
