import { useEffect } from "react"
import { domainList } from "../utils/tlds" // Import the domainList array

export default function Home() {
  useEffect(() => {
    let warning = document.querySelector('.warning'); // Select the warning element

    // Add event listener to the button

    document.getElementById('js-form').addEventListener('submit', async (event) => {
      event.preventDefault();


      let classToRemove = document.getElementById('domain-availability'); // Select the element to remove
      classToRemove.classList.remove('domain-taken', 'domain-free'); // Remove the class
      classToRemove.innerHTML = ''; // Remove the innerHTML

      let nameToCheck = document.getElementById('js-name').value.trim().replace(/\s/g, ""); // Gets the value of the input and removes spaces

      // Checks if the domain entered is greater than 1 character

      if (nameToCheck.length < 2) {
        warning.classList.remove('hidden'); // Show the warning
        return
      } else {
        warning.classList.add('hidden'); // Hide the warning
      }

      let domainName = nameToCheck.slice(0, nameToCheck.indexOf('.')); // Gets the domain name
      let domainExtention = nameToCheck.slice(nameToCheck.indexOf('.')); // Gets the domain extention

      // Checks if there is a domain extention ie. .com
      // If there is no domain extention, it will add .com to the end of the domain name

      if (!nameToCheck.includes('.')) {
        domainName = nameToCheck;
        domainExtention = '.com';
      }

      // Checks if the domain name is greater than 1 character

      if (domainName.length < 2) {
        warning.classList.remove('hidden'); // Show the warning
        return
      } else {
        warning.classList.add('hidden'); // Hide the warning
      }

      // Checks the domain extention against the list of TLDs
      if (domainList.includes(domainExtention)) {
        warning.classList.add('hidden'); // Hide the warning

        // Checks if the domain is taken by using SOA records
        const fetchDomain = () => {
          fetch(`https://cloudflare-dns.com/dns-query?type=SOA&name=${domainName}${domainExtention}`,
            {
              headers:
              {
                Accept: 'application/dns-json'
              }
            })
            .then(response => response.json())
            .then(response => {
              let hasSOA = false;
              // Checks if the response has an SOA record
              if (response.Answer) {
                hasSOA = response.Answer.some(record => record.type === 6);
              }

              const element = document.getElementById('domain-availability'); // Select the element
              element.classList.add(hasSOA ? 'domain-taken' : 'domain-free'); // If the domain has SOA record, add the domain-taken class, else add the domain-free class

              if (hasSOA) {
                element.innerHTML = `<span class='taken'>Unfortunately</span>, ${domainName}${domainExtention} is not available`;
              } else {
                element.innerHTML = `<span class='available'>Congratulations</span>, ${domainName}${domainExtention} is available`;
              }
            })
            .catch(error => {
              console.log(error);
            });
        };
        fetchDomain() // Call the function
      } else {
        warning.classList.remove('hidden'); // if domain list does not include the domain extention, show the warning
      }
    });
  }, [])
  return (
    <section className="section-domain-search">
      <div className="container">
        <h1>Find your perfect domain.</h1>
        <form id="js-form">
          <div className="form-container">
            <div>www.</div>
            <input type="text" id="js-name" placeholder="Enter your domain" />
            <button className="btn-color" type="submit">Search</button>
          </div>
          <p className="warning hidden">Please enter a vaild domain</p>
        </form>
        <h2 id="domain-availability" className="domain"></h2>
      </div>
    </section>
  )
}
