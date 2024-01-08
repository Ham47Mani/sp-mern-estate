/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from "react"
import { LISTING, USER } from "../utility/types"
import { Link } from "react-router-dom"

type contactLandlordProps = {
  listing: LISTING
}

const ContactLandlord = ({listing}: contactLandlordProps) => {
  const [landlord, setLandlord] = useState<USER | null>(null);
  const [message, setMessage] = useState<string>("");
  
  // Handle onchange textarea
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }

  useEffect(() => {
    // Fetch landlord user
    const getLandlordInfo = async () => {
      try {
        const res = await fetch(`/api/users/${listing.userRef}`, {method: 'GET'});
        const data = await res.json();
        if (!data.success) return;
        setLandlord(data.data[0]);
      } catch (err: any) {
        console.log(err.message);
      }
    }

    getLandlordInfo();
  }, [listing]);

  return (
    <>
      {
        landlord && (
          <div className="flex flex-col gap-6">
            <p className="tracking-wide">
              Contact <span className="font-semibold"> {landlord.username} </span> 
              for <span className="font-semibold"> {listing.name.toLowerCase()} </span>
            </p>
            <textarea name="message" id="message" className="w-full border border-slate-300 rounded-lg p-3 resize-none" rows={2} placeholder="Enter your message here..." value={message} onChange={handleChange}></textarea>
            <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className="bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95">Send Message</Link>
          </div>
        )
      }
    </>
  )
}

export default ContactLandlord