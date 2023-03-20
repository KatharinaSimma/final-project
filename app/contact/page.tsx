import {
  HeartIcon,
  RocketLaunchIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

export const metadata = {
  title: 'Contact',
  description: 'Contact Katharina Simma, she is a great developer!',
};

export default function Contact() {
  return (
    <main className="min-h-[calc(100vh-7rem)] mb-12 flex flex-col justify-center items-center p-5">
      <h1 className="py-5 text-3xl text-center">Contact</h1>

      <div className="flex flex-wrap items-center justify-center gap-12">
        <div className="p-8 shadow-xl card">
          <div className="card-body">
            <h2 className="m-auto card-title">Contact me</h2>
            <p>I'd love to hear from you.</p>

            <div className="flex flex-row gap-3 mt-6 form-control">
              <a
                className="mt-5 label-text-alt link link-hover hover:fill-primary"
                href="https://github.com/KatharinaSimma/"
                rel="noreferrer noopener"
                target="_blank"
              >
                <FaGithub className="w-12 h-12 fill-primary hover:fill-secondary" />
              </a>
              <a
                className="mt-5 label-text-alt link link-hover hover:fill-primary"
                href="https://www.linkedin.com/in/katharinasimma/"
                rel="noreferrer noopener"
                target="_blank"
              >
                <FaLinkedin className="w-12 h-12 fill-primary hover:fill-secondary" />
              </a>
              <a
                className="mt-5 label-text-alt link link-hover hover:fill-primary"
                href="mailto:katharina.simma@diebin.at"
                rel="noreferrer noopener"
                target="_blank"
              >
                <FaEnvelope className="w-12 h-12 fill-primary hover:fill-secondary" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-5">
          <RocketLaunchIcon className="w-12 h-12 fill-primary" />
          <p className="flex flex-col justify-center my-5 align-middle max-w-prose">
            I recently found my true calling as a developer after a career as a
            project coordinator. Here I am at the beginning of something new!
          </p>

          <SparklesIcon className="w-12 h-12 fill-primary" />
          <p className="flex flex-col justify-center my-5 align-middle max-w-prose">
            I just fell in love with coding. I enjoy learning about the nitty
            gritty details of a programming language as well as learning about
            architecture and infrastructure. I want my code to be secure and
            efficient.
          </p>

          <HeartIcon className="w-12 h-12 fill-primary" />

          <p className="flex flex-col justify-center my-5 align-middle max-w-prose">
            It is important to me that my work has meaning and improves peoples'
            lives. To me that also means practising accessibility and
            inclusivity - through my code and within my team.
          </p>
        </div>
      </div>
    </main>
  );
}
