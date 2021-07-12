using DrPatient_API.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace DrPatient_API.Controllers
{
    public class CCDController : ApiController
    {
        private DoctorPatientEntities db = new DoctorPatientEntities();
        [HttpGet]
        public IHttpActionResult GetCCD(string Patient_ID,string Doctor_ID)
        {
            var cCD = db.CCDs.Where(x=>x.Patient_ID==Patient_ID).ToList();
            if (cCD.Count()>0)
            {
                if (cCD[0].Doctor_ID != Doctor_ID)
                {
                    var refP = db.ReferPatients.Where(x=>x.Patient_ID==Patient_ID&&x.ReferTo_ID==Doctor_ID).FirstOrDefault();
                    if (refP == null)
                    {
                        return NotFound();
                    }

                    var fields = refP.AllowedFields;
                    var ids= fields.Split(',').ToList();
                    var rows = db.CCDs.Where(x => ids.Contains(x.CCD_ID.ToString())).ToList();
                    return Ok(rows);
                }
                else
                {
                    return Ok(cCD);
                }
            }
            return NotFound();
        }
        [HttpPost]
        public IHttpActionResult AddCCD(CCD[] cCDs)
        {
            if (cCDs.Length==0)
            {
                return BadRequest();
            }
            var fRecord = cCDs[0];
            var row = db.CCDs.Where(x => x.Patient_ID == fRecord.Patient_ID && x.Doctor_ID == fRecord.Doctor_ID).FirstOrDefault();
            if (row != null)
            {
                var rows = db.CCDs.Where(x => x.Patient_ID == fRecord.Patient_ID && x.Doctor_ID == fRecord.Doctor_ID).ToList();
                db.CCDs.RemoveRange(rows);
                try
                {
                    db.SaveChanges();

                }
                catch (Exception)
                {
                    throw;
                }
            }
            
                var res = db.CCDs.AddRange(cCDs);
                try
                {
                    db.SaveChanges();
                    return Ok(res);


                }
                catch (Exception)
                {
                    throw;
                }

        }

        [HttpPost]
        public IHttpActionResult ShareCCD(ReferPatient referPatient)
        {

            var row = db.ReferPatients.Where(x => x.ReferFrom_ID == referPatient.ReferFrom_ID && x.ReferTo_ID == referPatient.ReferTo_ID).FirstOrDefault();
            if (row == null)
            {
                var res = db.ReferPatients.Add(referPatient);
                try
                {
                    db.SaveChanges();
                    return Ok(res);

                }
                catch (Exception exc)
                {
                    return BadRequest(exc.ToString());
                }
            }
            else
            {
                row.AllowedFields = referPatient.AllowedFields;
                db.Entry(row).State = EntityState.Modified;
                try
                {
                    db.SaveChanges();
                    return Ok(row);

                }
                catch (Exception exc)
                {
                    return BadRequest(exc.ToString());
                }
            }
        }
    }
}

