import React from 'react';
import FAQ3 from '.';

const devfestFAQs = [
  {
    question: 'What is DevFest Kolkata 2026?',
    answer:
      "DevFest Kolkata is Eastern India's premier annual developer conference hosted by Google Developer Group (GDG) Kolkata and Women Techmakers. It brings together developers, creators, tech leaders, and innovators for world-class keynotes, deep-dive workshops, and community networking.",
  },
  {
    question: 'Who can attend DevFest Kolkata?',
    answer:
      'DevFest is open to everyone! Whether you are an experienced software engineer, student, tech founder, designer, or open-source enthusiast interested in AI, Cloud, Android, Web, and Firebase, you are warmly invited.',
  },
  {
    question: 'What is included with the conference pass?',
    answer:
      'Your pass includes full-day access to all keynote sessions and technical tracks, hands-on workshop codelabs, the official DevFest welcome kit with limited-edition swag, complimentary lunch & refreshments, and access to networking lounges.',
  },
  {
    question: 'When will speakers and the schedule be announced?',
    answer:
      'Speaker reveals are rolling out in mystery drops! Keep an eye on our website and follow @gdgkolkata across social media for speaker lineup announcements, workshop track releases, and registration details.',
  },
];

export default function FAQDemo() {
  return (
    <FAQ3
      badge="Frequently asked questions"
      heading="Everything you need to know"
      subheading="Get all the details about DevFest Kolkata 2026, registration, workshops, and attendee experience."
      items={devfestFAQs}
    />
  );
}
